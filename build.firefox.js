/* Gulpfile for chrome */
var gulp = require('gulp');
var gulpCopy = require('gulp-copy');
var jsmin = require('gulp-jsmin');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-dest-clean');
var replace = require('gulp-replace-task');
var bump = require('gulp-bump');
var zip = require('gulp-zip');
var exec = require('child_process').exec;
var fs = require('fs');
var rename = require("gulp-rename");

function existsSync(filename) {
  try {
    fs.accessSync(filename);
    return true;
  } catch(ex) {
    return false;
  }
}
gulp.task('manifest:firefox', function(){
	return gulp.src(['manifest.firefox.json'])
	.pipe(rename('manifest.json'))
	.pipe(gulp.dest(''));
});

var version = require("./manifest.firefox.json");
version = version.version;
if(existsSync('builds/'+version+'.firefox.zip')){
	console.error("\033[1;31mIt seems this version ("+version+") already has a build.\n Please Bump the version, or remove the build zip file from the builds folder.\033[0m");
	gulp.task('default', [], function(cb) {cb();});
	return;
}

gulp.task('clean-scripts', function () {
	return gulp.src("./", {read: false})
	.pipe(clean("builds/firefox"));
});

gulp.task('webpack', function (cb) {
	exec('webpack', function (err, stdout, stderr) {
    console.log(stderr);
    cb(err);
  });
});

gulp.task('movefiles', ['clean-scripts', 'webpack'], function(cb){
	return gulp.src(['background.html','pages/help/index.html', 'pages/install/index.html', 'pages/settings/index.html','tickbar/font/OpenSans-Light_gdi.*'])
	.pipe(gulpCopy('builds/firefox', {}));
});

gulp.task('removeManifestKey', ['clean-scripts', 'webpack'], function(cb){
	return gulp.src(['manifest.firefox.json'], {base:'./'})
	.pipe(rename('manifest.json'))
	.pipe(gulp.dest('builds/firefox'));
});

gulp.task('minifyImages', ['clean-scripts', 'webpack'], function(cb){
	return 	gulp.src(['images/*'], {base:'./'})
	.pipe(imagemin())
	.pipe(gulp.dest('builds/firefox'));
});

gulp.task('minifyCss', ['clean-scripts', 'webpack'], function(cb){
	return gulp.src([ 'tickbar/font/*.css','dist/*.css'],{base: './'})
	.pipe(cleanCSS())
	.pipe(gulp.dest('builds/firefox'));
});

gulp.task('minifyJs', ['clean-scripts', 'webpack'], function(cb){
	return gulp.src(['background.js','dist/*.js', 'libs/*.js'], {base: './'})
	.pipe(jsmin())
	.pipe(gulp.dest('builds/firefox'));
});

gulp.task('build',['movefiles','removeManifestKey','minifyImages','minifyCss','minifyJs'], function(cb){
	console.log("Build Completed!");
	cb();
});

gulp.task('compress',['build'], function(cb){
	return gulp.src('builds/firefox/**/*')
        .pipe(zip(version+'.firefox.zip'))
        .pipe(gulp.dest('builds/'));
});

gulp.task('default', ['build', 'compress'], function(cb) {cb();});

