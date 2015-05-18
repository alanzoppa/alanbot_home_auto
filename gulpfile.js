require('babel/register')
var gulp = require('gulp');
var CameraAimer = require('./events/camera_aimer')
var argv = require('yargs').argv;
var config = require('./config');
var HueSettings = require('./lib/hue_settings');

var HomeStateMachine = require('./lib/state_manager');
var stateMachine = new HomeStateMachine();

gulp.task('default', function(done) {
    var aimer = new CameraAimer();
    aimer.setState('watch');
});

gulp.task('watch', function(done) {
    console.log('watch');
});


gulp.task('setState', function() {
    stateMachine.transition(argv.state);
});


gulp.task('cameHome', function() {
    var cameHomeRobotMaker = require('./events/came_home_blink');
    var hueSettings = new HueSettings(config);
    hueSettings.setup.then(function(){
        var robot = cameHomeRobotMaker(hueSettings);
        robot.start();
    })
});
