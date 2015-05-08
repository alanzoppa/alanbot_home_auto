var should = require('chai').should();
var config = require('../config.json').camera;
var config = require('../example_config.json').camera;
var test_data = require('../test_data.json').camera;
var CameraAimer = require('../events/camera_aimer');
var nock = require('nock');
var url = require('url');
var events = require('events');


describe('camera_aimer', function() {
    beforeEach(function() {
        this.emitter = new events.EventEmitter();
        this.cameraAimer = new CameraAimer(this.emitter, config);
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
        var paths = this.cameraAimer.pathsForState('watch');
        for (let path of paths) {
            var parsed = url.parse(path);
            var xmlResult = "<CGI_Result><result>0</result><runResult>0</runResult></CGI_Result>";
            var theNock = nock(`${parsed.protocol}\/\/${parsed.host}`)
                .get(parsed.path)
                .delay(100)
                .reply(200, xmlResult)
        }
        this.cameraAimer.setState('watch').then((result)=> {
            var allTrue = result.every(function(i){return i});
            allTrue.should.be.true;
            this.cameraAimer.state.should.eql('watch');
            done();
        })

    })
    it('should error for invalid settings', function(done) {
        var paths = this.cameraAimer.pathsForState('watch');
        for (let path of paths) {
            var parsed = url.parse(path);
            var xmlResult = "<CGI_Result><result>0</result><runResult>2</runResult></CGI_Result>";
            nock(`${parsed.protocol}\/\/${parsed.host}`)
                .get(parsed.path)
                .delay(100)
                .reply(200, xmlResult)
        }
        this.cameraAimer.setState('watch').catch((result)=> {
            result.should.eql("The command failed");
            done();
        })

    })
    it('should 404 for invalid urls', function(done) {
        var paths = this.cameraAimer.pathsForState('watch');
        for (let path of paths) {
            var parsed = url.parse(path);
            nock(`${parsed.protocol}\/\/${parsed.host}`)
                .get(parsed.path)
                .delay(100)
                .reply(404, "whatever")
        }
        this.cameraAimer.setState('watch').catch(function(result){
            result.should.eql("The command failed");
            done();
        })

    })

    it('should change to lookaway when the cameHome event is emitted', function(done) {
        var paths = this.cameraAimer.pathsForState('lookAway');
        for (let path of paths) {
            var parsed = url.parse(path);
            var xmlResult = "<CGI_Result><result>0</result><runResult>0</runResult></CGI_Result>";
            var theNock = nock(`${parsed.protocol}\/\/${parsed.host}`)
                .get(parsed.path)
                .delay(100)
                .reply(200, xmlResult)
        }
        this.emitter.emit('cameHome');
        setTimeout(() => {
            theNock.isDone().should.be.true;
            this.cameraAimer.state.should.eql('lookAway');
            done();
        }, 150)
    })

    it('should change to watch when the wentAway event is emitted', function(done) {
        var paths = this.cameraAimer.pathsForState('watch');
        for (let path of paths) {
            var parsed = url.parse(path);
            var xmlResult = "<CGI_Result><result>0</result><runResult>0</runResult></CGI_Result>";
            var theNock = nock(`${parsed.protocol}\/\/${parsed.host}`)
                .get(parsed.path)
                .delay(100)
                .reply(200, xmlResult)
        }
        this.emitter.emit('wentAway');
        setTimeout(() => {
            theNock.isDone().should.be.true;
            this.cameraAimer.state.should.eql('watch');
            done();
        }, 150)
    })





})
