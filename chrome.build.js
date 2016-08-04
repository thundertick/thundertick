/* Gulpfile for chrome */
var gulp = require('gulp');
var gulpCopy = require('gulp-copy');
var jsmin = require('gulp-jsmin');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-dest-clean');
var replace = require('gulp-replace-task');
var bump = require('gulp-bump');

var exec = require('child_process').exec;

gulp.task('clean-scripts', function () {
	
	return gulp.src("./", {read: false})
	.pipe(clean("builds/chrome"));

});

gulp.task('webpack', function (cb) {
	exec('webpack', function (err, stdout, stderr) {
    //console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('default', ['webpack','clean-scripts'], function(cb) {
	gulp.src(['background.html'])
	.pipe(gulpCopy('builds/chrome', {}));

	gulp.src(['manifest.json'], {base:'./'})
	.pipe(replace({
		patterns:[
			{
				match: /\"key\":.+\n/g,
				replacement:''
			}
		]
	}))
	.pipe(gulp.dest('builds/chrome'));

	gulp.src(['images/*'], {base:'./'})
	.pipe(imagemin())
	.pipe(gulp.dest('builds/chrome'));

	gulp.src([ 'tickbar/font/*','dist/*.css'],{base: './'})
	.pipe(cleanCSS())
	.pipe(gulp.dest('builds/chrome'));

	gulp.src(['background.js','dist/*.js', 'libs/*.js'], {base: './'})
	.pipe(jsmin())
	.pipe(gulp.dest('builds/chrome'));
});

gulp.task('bump:major', function(){
  gulp.src(['./manifest.json','./package.json'])
  .pipe(bump({type:'major'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function(){
  gulp.src(['./manifest.json','./package.json'])
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});
gulp.task('bump:patch', function(){
  gulp.src(['./manifest.json','./package.json'])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});