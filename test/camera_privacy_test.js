var should = require('chai').should();
var config = require('../config.json').camera;
var config = require('../example_config.json').camera;
var test_data = require('../test_data.json').camera;
var CameraAimer = require('../events/camera_aimer');


describe('camera_aimer', function() {
    beforeEach(function() {
        this.cameraAimer = new CameraAimer(config);
    })
    it('should have path, params and states ', function() {
        this.cameraAimer.config.should.have.all.keys('base', 'path', 'params', 'states')
    }),
    it('should return arrays of params for any state', function() {
        var arrayOfParams = this.cameraAimer._paramsFor('watch');

        var expected = test_data.expectedParams;
        arrayOfParams.should.eql(expected);
    }),
    it('should return full urls for a state', function() {
        this.cameraAimer.pathsForState('watch').should.eql(test_data.expectedUrls);
    })
})
