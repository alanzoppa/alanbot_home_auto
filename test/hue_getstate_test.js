var HueSettings = require('../hue_settings');
var config = require('../example_config');
var url = require('url');
var fake_hue_response = require('./fake_hue_config');
require('chai').should();
var nock = require('nock');

function nockHueConfig(settings) {
    var parsed = url.parse(settings.hue_config_url);
    var theNock = nock(`${parsed.protocol}\/\/${parsed.host}`)
        .get(parsed.path)
        .delay(10)
        .reply(200, fake_hue_response)
}

describe("Hue Config Creator", function(){
    beforeEach(function(){
        this.hueSettings = new HueSettings(config);
    })
    it("Should get the url", function() {
        nockHueConfig(this.hueSettings);
        this.hueSettings.hue_config_url.should.eql('http://192.168.1.1/api/0000000000000000000000000000000')
    })
})
