var fs = require('fs');
var fake_smartthings_payloads = require('./fake_smartthings_payloads.json'); 
var url = require('url');
var nock = require('nock');
require('chai').should();
var CameraAimer = require('../lib/camera_aimer');
var events = require('events');
var emitter = new Object();
var R = require('ramda')
var config = R.clone(require('../config.json'));

var HomeStateMachine = require('../lib/state_manager');

var cameraAimer = new CameraAimer(config.camera);

function nockState(state) {
    var paths = cameraAimer.pathsForState(state);
    for (let path of paths) {
        var parsed = url.parse(path);
        var xmlResult = "<CGI_Result><result>0</result><runResult>0</runResult></CGI_Result>";
        var theNock = nock(`${parsed.protocol}\/\/${parsed.host}`)
            .get(parsed.path)
            .delay(100)
            .reply(200, xmlResult)
    } 
}

describe("State Manager", function() {
    beforeEach(function() {
        try {fs.unlinkSync(HomeStateMachine.prototype.stateFileName);}
        catch (e){}
    })

    it("should end up in home by default", function() {
        nockState('lookAway');
        var stateManager = new HomeStateMachine(); 
        stateManager.state.should.eql('home');
    })
    it("should resume states", function() {
        fs.writeFileSync(HomeStateMachine.prototype.stateFileName, 'away');
        nockState('watch');
        var stateManager = new HomeStateMachine();
        stateManager.state.should.eql('away'); 
    })
    it("should go back to default", function() {
        nockState('lookAway');
        var stateManager = new HomeStateMachine();
        stateManager.state.should.eql('home');
    })
    it("should be able to transition to evening", function() {
        nockState('lookAway');
        var stateManager = new HomeStateMachine();
        stateManager.stEvent(fake_smartthings_payloads[7])
        stateManager.state.should.eql('evening');
    }) 
    it("should respond to smartthings events", function() {
        nockState('lookAway');
        var stateManager = new HomeStateMachine();
        stateManager.state.should.eql('home');
        nockState('watch');
        stateManager.stEvent(fake_smartthings_payloads[1])
        stateManager.state.should.eql('away');
        nockState('lookAway');
        stateManager.stEvent(fake_smartthings_payloads[0])
        stateManager.state.should.eql('home');
    }) 
    it("should respond to smartthings events", function() {
        var stateManager = new HomeStateMachine();
        stateManager._allowedStates().should.eql(
                [ 'home', 'away', 'evening', 'night' ]
                )
    })
})
