var fs = require('fs');
var fake_smartthings_payloads = require('./fake_smartthings_payloads.json'); 
require('chai').should();


var HomeStateMachine = require('../state_manager');
//var stateFileName = tmpStateManager.stateFileName;

describe("State Manager", function() {
    beforeEach(function() {
        try {fs.unlinkSync(HomeStateMachine.prototype.stateFileName);}
        catch (e){}
    })
    it("should end up in home by default", function() {
        var stateManager = new HomeStateMachine();
        stateManager.state.should.eql('home');
    })
    it("should resume states", function() {
        fs.writeFileSync(HomeStateMachine.prototype.stateFileName, 'away');
        var stateManager = new HomeStateMachine();
        stateManager.state.should.eql('away'); 
    })
    it("should go back to default", function() {
        var stateManager = new HomeStateMachine();
        stateManager.state.should.eql('home');
    })
    it("should respond to smartthings events", function() {
        var stateManager = new HomeStateMachine();
        stateManager.state.should.eql('home');
        stateManager.stEvent(fake_smartthings_payloads[1])
        stateManager.state.should.eql('away');
        stateManager.stEvent(fake_smartthings_payloads[0])
        stateManager.state.should.eql('home');
    })
})
