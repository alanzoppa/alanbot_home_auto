var HueSettings = require('../hue_settings');
var config = require('../example_config');
var url = require('url');
var nock = require('nock');
var fake_hue_response = require('./fake_hue_config');
var blinkBotMaker = require('../events/came_home_blink');


function nockHueConfig(settings) {
    var parsed = url.parse(settings.hue_config_url);
    var theNock = nock(`${parsed.protocol}\/\/${parsed.host}`)
        .get(parsed.path)
        .delay(10)
        .reply(200, fake_hue_response)
}

function nockHueState(settings, light, on) {
    var lightId = settings.cylonLights[light].lightId;
    var parsed = url.parse(settings.hue_config_url);
    var theNock = nock(`${parsed.protocol}\/\/${parsed.host}`)
        .put(parsed.path+`/lights/${lightId}/state`)
        .delay(10)
        .reply(200, {"on": on})
}


describe("Lights", function(){
    beforeEach(function(done){
        var that = this;
        this.hueSettings = new HueSettings(config);
        nockHueConfig(this.hueSettings);
        this.hueSettings.setup.then(function() {
            that.blinkBot = blinkBotMaker(that.hueSettings);
            done();
        })
    })
    it("Should light", function() {
       nockHueState(this.hueSettings, 'Kitchen 1', true);
       nockHueState(this.hueSettings, 'Kitchen 2', true);
       nockHueState(this.hueSettings, 'Kitchen 3', true);
       nockHueState(this.hueSettings, 'Kitchen 1', false);
       nockHueState(this.hueSettings, 'Kitchen 2', false);
       nockHueState(this.hueSettings, 'Kitchen 3', false);
       this.blinkBot.start();

    })
})
