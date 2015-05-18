var should = require('chai').should();
var config = require('../config.json').camera;
var config = require('../example_config.json').camera;
var test_data = require('../test/test_data.json').camera;
var CameraAimer = require('../lib/camera_aimer');
var nock = require('nock');
var url = require('url');

var sharedNocks = require('./shared_nocks');


describe('camera_aimer', function() {
    beforeEach(function() {
        this.cameraAimer = new CameraAimer(config);
    })

    it('should have path, params and states ', function() {
        this.cameraAimer.config.should.have.all.keys('base', 'path', 'params', 'states')
    })

    it('should return arrays of params for any state', function() {
        var arrayOfParams = this.cameraAimer._paramsFor('watch'); 
        var expected = test_data.expectedParams;
        arrayOfParams.should.eql(expected);
    })

    it('should return full urls for a state', function() {
        this.cameraAimer.pathsForState('watch').should.eql(test_data.expectedUrls);
    })

    it('should return true for valid settings', function(done) {
        var expectations = sharedNocks.cameraPoint('watch', true); 
        this.cameraAimer.setState('watch').then((result)=> {
            var allTrue = result.every(function(i){return i});
            allTrue.should.be.true;
            expectations.forEach(function(expectation){ expectation.done(); });
            this.cameraAimer.state.should.eql('watch');
            done();
        }) 
    })

    it('should error for invalid settings', function(done) {
        var expectations = sharedNocks.cameraPoint('watch', false);
        this.cameraAimer.setState('watch').catch((result)=> {
            result.should.eql("The command failed");
            expectations.forEach(function(expectation){ expectation.done(); })
            done();
        })

    })

    it('should 404 for invalid urls', function(done) {
        var expectations = sharedNocks.cameraPoint('watch', false, 404);
        this.cameraAimer.setState('watch').catch(function(result){
            result.should.eql("The command failed");
            expectations.forEach(function(expectation){ expectation.done(); })
            done();
        })

    })

})
