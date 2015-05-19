var HueSettings = require('../lib/hue_settings');
var config = require('../example_config');
var url = require('url');
var nock = require('nock');
var fake_hue_response = require('./fake_hue_config');
var blinkBotMaker = require('../lib/came_home_blink');
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

    afterEach(function() {
        nock.cleanAll();
    })

    it("Should light", function(done) {
        var expectations = sharedNocks.nockCameHomeBlink(this.hueSettings);
        this.blinkBot.start();
        setTimeout( function() {
            expectations.forEach(function(expectation) {
                expectation.done(); //error if expectation.isDone() == false;
            })
            done();
        }, 150)
    })
})
