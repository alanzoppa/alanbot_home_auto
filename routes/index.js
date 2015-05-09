var express = require('express');
var router = express.Router();
var events = require('events')
var config = require('../config.json');
var CameraAimer = require('../events/camera_aimer');

var emitter = new events.EventEmitter();
var aimer = new CameraAimer(emitter, config.camera);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post('/', function(req, res, next) {
    //{ date: '2015-05-07T19:38:24.715Z',
      //value: 'Home',
      //name: 'mode',
      //display_name: 'Home',
      //description: 'Home is now in Home mode',
      //source: 'LOCATION',
      //state_changed: true,
      //physical: false,
      //location_id: '8a1eca113efb6b34013f1f1915b6031f',
      //hub_id: null }
  console.log(req.body);
  if (req.body.value == 'Home') {
      emitter.emit('cameHome');
      console.log('emitted came home')
  }
  else if (req.body.value == 'Away' ) {
      emitter.emit('wentAway');
      console.log('emitted went away')
  }
  res.json({success: true})
}); 


module.exports = router;
