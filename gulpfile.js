require('babel/register')
var gulp = require('gulp');
var CameraAimer = require('./events/camera_aimer')

gulp.task('default', function() {
    var aimer = new CameraAimer();
    aimer.setState('watch');
});
