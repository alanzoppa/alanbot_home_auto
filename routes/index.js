var express = require('express');
var router = express.Router();
var events = require('events')
var config = require('../config.json');
var CameraAimer = require('../lib/camera_aimer');
var SmartthingsPayloadLogger = require('../lib/smartthings_payload_logger');

var aimer = new CameraAimer(config.camera);

var stLogger = new SmartthingsPayloadLogger();
var HomeStateMachine = require('../lib/state_manager');
var stateMachine = new HomeStateMachine();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({success: true})
}); 

router.post('/', function(req, res, next) {
  stLogger.log(req.body);
  stateMachine.stEvent(req.body);
  res.json({success: true})
}); 


module.exports = router;
