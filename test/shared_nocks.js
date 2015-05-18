var nock = require('nock');
var url = require('url');
var fake_hue_response = require('./fake_hue_config');
var config = require('../example_config.json'); 
var CameraAimer = require('../lib/camera_aimer');
var cameraAimer = new CameraAimer(config.camera);

module.exports = {
    nockHueConfig: function (settings) {
        var parsed = url.parse(settings.hue_config_url);
        return nock(`${parsed.protocol}\/\/${parsed.host}`)
            .get(parsed.path)
            .delay(10)
            .reply(200, fake_hue_response)
    }, 

    nockHueState: function (settings, light, on) {
        var lightId = settings.cylonLights[light].lightId;
        var parsed = url.parse(settings.hue_config_url);
        return nock(`${parsed.protocol}\/\/${parsed.host}`)
            .put(parsed.path+`/lights/${lightId}/state`)
            .delay(10)
            .reply(200, {"on": on})
    },

    cameraPoint: function(state, success, statusCode) {
        success = (success == undefined ? true : success);
        var responseCode = (success ? 0 : 2);
        var statusCode = (statusCode == undefined ? 200 : statusCode);
        var xmlResult = `
            <CGI_Result>
                <result>0</result>
                <runResult>${responseCode}</runResult>
            </CGI_Result>
            `;

        var paths = cameraAimer.pathsForState(state);
        var output = [];
        for (let path of paths) {
            var parsed = url.parse(path);
            var theNock = nock(`${parsed.protocol}\/\/${parsed.host}`)
                .get(parsed.path)
                .delay(100)
                .reply(statusCode, xmlResult)

            output.push(theNock);
        }
        return output;

    }


}
