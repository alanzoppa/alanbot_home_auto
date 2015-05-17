var nock = require('nock');
var url = require('url');
var fake_hue_response = require('./fake_hue_config');


module.exports = {
    nockHueConfig: function (settings) {
    var parsed = url.parse(settings.hue_config_url);
    var theNock = nock(`${parsed.protocol}\/\/${parsed.host}`)
        .get(parsed.path)
        .delay(10)
        .reply(200, fake_hue_response)
    }, 

    nockHueState: function (settings, light, on) {
        var lightId = settings.cylonLights[light].lightId;
        var parsed = url.parse(settings.hue_config_url);
        var theNock = nock(`${parsed.protocol}\/\/${parsed.host}`)
            .put(parsed.path+`/lights/${lightId}/state`)
            .delay(10)
            .reply(200, {"on": on})
    }


}
