var gulp = require('gulp');

gulp.task('default', function() {
// place code for your default task here
});

var ui5preload = require('gulp-ui5-preload');
//var uglify = require('gulp-uglify');
var uglify = require('gulp-uglify-es').default;
var gulpif = require('gulp-if');

gulp.task('ui5preload', function() {
return gulp.src(
[ '**/**.+(js|xml)', '!Component-preload.js', '!gulpfile.js',
'!model/metadata.xml' ]).pipe(gulpif('**/*.js', uglify())) //only pass .js files to uglify
.pipe(ui5preload({
base : '.',
namespace : 'com.acute.ticketZSC'
})).pipe(gulp.dest('.'));
})