var fs = require('fs');
var Q = require('q');

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

class SmartthingsPayloadLogger {
    constructor() {
        this.keys = [
            "date",
            "value",
            "name",
            "display_name",
            "description",
            "source",
            "state_changed",
            "physical",
            "location_id",
            "hub_id"
        ]
        this.logPath = __dirname+'/logs';
        this.logFilename = `${this.logPath}/${this._generateFilename()}`;
        this._ensureLogfileWithHeader();
    }

    _createCSVString(obj) {
        var keys = this.keys.slice();
        var values = keys.map( (key)=> {
            return obj[key]
        })
        return values.join()+"\n";
    }
    
    _generateHeader() {
        return this.keys.join()+"\n";
    }

    _generateFilename() {
        var date = new Date();
        var month = pad(date.getMonth()+1, 2);
        return `smartthings-requests-${month}-${date.getFullYear()}.log`
    }

    _ensureLogfileWithHeader() {
        try { fs.openSync(this.logFilename, 'r') }
        catch (e) {
            var file = fs.openSync(this.logFilename, 'w');
            fs.writeSync(file, this._generateHeader())
            fs.closeSync(file);
        }
    }

    log(stPayload, callback) {
       var csvRow = this._createCSVString(stPayload);
       fs.appendFile(this.logFilename, csvRow, function(err){
           if ((err === null) && (callback !== undefined)) {
               callback()
           }
           //if (callback) {callback()}
       })
    }
}


module.exports = SmartthingsPayloadLogger;
