var routes = require('../routes/index');
var fake_smartthings_payloads = require('./fake_smartthings_payloads.json');
var SmartthingsPayloadLogger = require('../smartthings_payload_logger');
var CameraAimer = require('../events/camera_aimer');
var nock = require('nock');
var config = require('../config.json');
var events = require('events');
var url = require('url');
var fs = require('fs');
require('chai').should();
var stLogger = new SmartthingsPayloadLogger();

describe("route file behavior", function() {
    beforeEach(function() {
        this.logger = new SmartthingsPayloadLogger();
        this.emitter = new events.EventEmitter();
        this.cameraAimer = new CameraAimer(this.emitter, config.camera); 
    })

    it('should log requests made to the route', function(done) {
        var paths = this.cameraAimer.pathsForState('lookAway');
        for (let path of paths) {
            var parsed = url.parse(path);
            var xmlResult = "<CGI_Result><result>0</result><runResult>0</runResult></CGI_Result>";
            var theNock = nock(`${parsed.protocol}\/\/${parsed.host}`)
                .get(parsed.path)
                .delay(100)
                .reply(200, xmlResult)
        } 


        var f = routes.stack[1].route.stack[0].handle;
        var req = {
            body: fake_smartthings_payloads[0]
        }
        var res = {
            json: function(jsonData) {
                jsonData.should.eql({"success": true});
                fs.unlinkSync(stLogger.logFilename)
                done();
            }
        }
        f(req, res)
    })
})
