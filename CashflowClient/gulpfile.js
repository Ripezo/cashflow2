// npm i -D gulp gulp-concat gulp-streamify gulp-uglify gulp-concat gulp-concat-css browser-sync browserify-shim browserify vinyl-source-stream
// npm i -S jquery phaser bootstrap md5-js

var Gulp        = require('gulp');
var Browserify  = require('browserify');
var BrowserSync = require('browser-sync');
var Streamify   = require('gulp-streamify');
var Uglify      = require('gulp-uglify');
var Concat      = require('gulp-concat');
var ConcatCss   = require('gulp-concat-css');
var Source      = require('vinyl-source-stream');

Gulp.task('default', ['css', 'script', 'watch', 'server']);

Gulp.task('css', function(){
    return Gulp.src(
    [
        './node_modules/dropzone/dist/min/dropzone.min.css',
        './src/css/**/*.css'
    ])
    .pipe(ConcatCss('styles.css'))
    .pipe(Gulp.dest('./publish/css/'));
});

Gulp.task('script', ['script-compile', 'script-concat']);

Gulp.task('script-compile', function () {
    var bundleStream = Browserify('./src/Main.js').bundle();

    return bundleStream
        .pipe(Source('scripts.js'))
        //.pipe(Streamify(Uglify()))
        .pipe(Gulp.dest('./publish/js/'));
});

Gulp.task('script-concat', ['script-compile'], function () {
    return Gulp.src(
    [
        './node_modules/phaser/build/phaser.min.js',
        './node_modules/dropzone/dist/min/dropzone.min.js',
        './publish/js/scripts.js'
    ])
    .pipe(Concat('scripts.js'))
    .pipe(Gulp.dest('./publish/js/'));
});


Gulp.task('server', ['script'], function () {
    return BrowserSync.init([ './publish/index.html', './publish/js/scripts.js', './publish/css/styles.css'], {
        server: {
            baseDir: './publish/'
        }
    });
});

Gulp.task('watch', ['watch-scripts', 'watch-css']);

Gulp.task('watch-scripts', ['script'], function () {
    return Gulp.watch('./src/**/*.js', ['script']);
});

Gulp.task('watch-css', ['css'], function () {
    return Gulp.watch('./src/css/**/*.css', ['css']);
});
