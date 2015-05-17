var request = require('request');
var Q = require('q');

class HueSettings {
    constructor(config) {
        this.hue_config_url = `http://${config.hue.cylon.host}/api/${config.hue.cylon.username}`;
        var config_deferral = Q.defer();
        this.config_promise = config_deferral.promise;
        request(this.hue_config_url, function(err, res, body) {
            if (err) { config_deferral.reject(err) }
            config_deferral.resolve(JSON.parse(body));
        })
    }
}

module.exports = HueSettings;


//http://192.168.1.11/api/1d37bee36377f4f314ee3db391646c7
