var express = require('express');
var router = express.Router();
var events = require('events')
var config = require('../config.json');
var CameraAimer = require('../events/camera_aimer');
var SmartthingsPayloadLogger = require('../smartthings_payload_logger');

var emitter = new events.EventEmitter();
var aimer = new CameraAimer(emitter, config.camera);

var stLogger = new SmartthingsPayloadLogger();
var HomeStateMachine = require('../state_manager');
var stateMachine = new HomeStateMachine();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); 

router.post('/', function(req, res, next) {
  stLogger.log(req.body);
  stateMachine.stEvent(req.body);
  res.json({success: true})
}); 


module.exports = router;
