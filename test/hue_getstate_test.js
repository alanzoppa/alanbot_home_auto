var HueSettings = require('../hue_settings');
var config = require('../example_config');
var url = require('url');
var fake_hue_response = require('./fake_hue_config');
require('chai').should();
var nock = require('nock');
var sharedNocks = require('./shared_nocks')

describe("Hue Config Creator", function(){
    beforeEach(function(){
        this.hueSettings = new HueSettings(config);
        sharedNocks.nockHueConfig(this.hueSettings);
    })
    it("Should get the url", function() {
        this.hueSettings.hue_config_url.should.eql('http://192.168.1.1/api/0000000000000000000000000000000')
    })
    it("Should get the lights", function(done) { 
        var expected = { 
          'Living Room 1': { driver: 'hue-light', lightId: 1 },
          'Living Room 2': { driver: 'hue-light', lightId: 2 },
          'Bedroom': { driver: 'hue-light', lightId: 3 },
          'Storage Room': { driver: 'hue-light', lightId: 4 },
          'Kitchen 1': { driver: 'hue-light', lightId: 5 },
          'Kitchen 2': { driver: 'hue-light', lightId: 6 },
          'Kitchen 3': { driver: 'hue-light', lightId: 7 }
        }
        this.hueSettings.setup.then(function(hueSettings){
            hueSettings.cylonLights.should.eql(expected);
            done();
        })
    })
    it('should pass on the cylon config object', function() {
        let cfg = this.hueSettings.cylonConfig();
        cfg.adaptor.should.eql('hue');
    })
})


