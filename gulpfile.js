var gulp = require('gulp');
var filter = require('gulp-filter');
var tslint = require('gulp-tslint');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
var print = require('gulp-print');
var util = require('gulp-util');
var config = require('./gulp.config')();

var sources = tsc.createProject(config.project);
var tests = tsc.createProject(config.project);

function compileSource() {
    // var merge = require('merge2');
    var result = gulp
        .src(config.sources.files.all)
        .pipe(sourcemaps.init())
        .pipe(sources());

    var js = result
        .js
        .pipe(sourcemaps.write(config.sources.maps))
        .pipe(gulp.dest(config.sources.dest));

    // var d = result.dts.pipe(gulp.dest('./lib/'));
    return js;
    // return merge(js, d);
}

function compileTests() {
    var files = [config.typings].concat(
        config.sources.files.all,
        config.tests.files.all
    );

    var result = gulp
        .src(files)
        .pipe(sourcemaps.init())
        .pipe(tests());

    var specs = filter(config.tests.filter);

    return result
        .js
        .pipe(specs)
        .pipe(sourcemaps.write(config.tests.maps))
        .pipe(gulp.dest(config.tests.dest));
}

function csSource() {
    return gulp
        .src(config.sources.files.all)
        .pipe(tslint(config.tslint))
        .pipe(tslint.report());
}

function swallow(error) {
    util.log('sw ' + error);
    this.emit('end');
}

function csSourceWatch() {
    return gulp
        .src(config.sources.files.all, { since: gulp.lastRun(csSourceWatch) })
        .pipe(tslint(config.tslint))
        .pipe(tslint.report({
            emitError: false
        }));
}

function csTests() {
    return gulp
        .src(config.tests.files.all)
        .pipe(tslint(config.tslint))
        .pipe(tslint.report());    
}

function runTests() {
    return gulp
        .src(config.tests.specs.all)
        .pipe(jasmine(config.tests.jasmine));
}

function watch() {
    gulp.watch(config.sources.files.all, csSourceWatch);
}

gulp.task('cs-src', csSource);
gulp.task('cs-tests', csTests);
gulp.task('cs', gulp.parallel(csSource, csTests));

gulp.task('compile-source', gulp.series(csSource, compileSource));
gulp.task('compile-tests', gulp.series(csTests, compileTests));
gulp.task('compile', gulp.parallel('compile-source', 'compile-tests'));

gulp.task('test', gulp.series('compile', runTests));

gulp.task('w', watch);
