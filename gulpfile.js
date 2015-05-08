require('babel/register')
var gulp = require('gulp');
var CameraAimer = require('./events/camera_aimer')
var argv = require('yargs').argv;

gulp.task('default', function(done) {
    var aimer = new CameraAimer();
    aimer.setState('watch');
});

gulp.task('watch', function(done) {
    console.log('watch');
});


//gulp setState --state watch
//gulp setState --state lookAway

gulp.task('setState', function() {
    var aimer = new CameraAimer();
    return aimer.setState(argv.state);
});
