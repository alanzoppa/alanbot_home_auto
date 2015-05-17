var HueSettings = require('../hue_settings');
var config = require('../example_config');
var url = require('url');
var nock = require('nock');
var fake_hue_response = require('./fake_hue_config');
var blinkBotMaker = require('../events/came_home_blink');
var sharedNocks = require('./shared_nocks')


describe("Lights", function(){
    beforeEach(function(done){
        var that = this;
        this.hueSettings = new HueSettings(config);
        sharedNocks.nockHueConfig(this.hueSettings);
        this.hueSettings.setup.then(function() {
            that.blinkBot = blinkBotMaker(that.hueSettings, 10);
            done();
        })
    })
    it("Should light", function(done) {
       sharedNocks.nockHueState(this.hueSettings, 'Kitchen 1', true);
       sharedNocks.nockHueState(this.hueSettings, 'Kitchen 2', true);
       sharedNocks.nockHueState(this.hueSettings, 'Kitchen 3', true);
       sharedNocks.nockHueState(this.hueSettings, 'Kitchen 1', false);
       sharedNocks.nockHueState(this.hueSettings, 'Kitchen 2', false);
       sharedNocks.nockHueState(this.hueSettings, 'Kitchen 3', false);

       sharedNocks.nockHueState(this.hueSettings, 'Kitchen 1', true);
       sharedNocks.nockHueState(this.hueSettings, 'Kitchen 2', true);
       sharedNocks.nockHueState(this.hueSettings, 'Kitchen 3', true);
       sharedNocks.nockHueState(this.hueSettings, 'Kitchen 1', false);
       sharedNocks.nockHueState(this.hueSettings, 'Kitchen 2', false);
       sharedNocks.nockHueState(this.hueSettings, 'Kitchen 3', false);

       this.blinkBot.start();
       setTimeout( function() {
               done();
       }, 150)
    })
})
