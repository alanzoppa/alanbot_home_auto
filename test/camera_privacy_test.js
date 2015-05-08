var should = require('chai').should();
var config = require('../config.json').camera;
var config = require('../example_config.json').camera;
var test_data = require('../test_data.json').camera;
var CameraAimer = require('../events/camera_aimer');
var nock = require('nock');
var url = require('url');


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
    it('should get status 0 for valid settings', function(done) {
        var paths = this.cameraAimer.pathsForState('watch');
        for (let path of paths) {
            var parsed = url.parse(path);
            var xmlResult = "<CGI_Result><result>0</result><runResult>0</runResult></CGI_Result>";
            nock(`${parsed.protocol}\/\/${parsed.host}`)
                .get(parsed.path)
                .delay(250)
                .reply(200, xmlResult)
        }
        this.cameraAimer.setState('watch').then(function(result){
            var allTrue = result.every(function(i){return i});
            allTrue.should.be.true;
            done();
        })

    })




})
