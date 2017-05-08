var gulp = require('gulp');
var filter = require('gulp-filter');
var tslint = require('gulp-tslint');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var jasmine = require('gulp-jasmine');
var print = require('gulp-print');
var util = require('gulp-util');
var stream = require('streamqueue');
var watcher = require('./build/watcher');

var config = require('./gulp.config')();

var sources = tsc.createProject(config.project);
var tests = tsc.createProject(config.project);

function compileSource() {
    return gulp
        .src(config.sources.files.all)
        .pipe(sourcemaps.init())
        .pipe(sources())
        .js
        .pipe(sourcemaps.write(config.sources.maps))
        .pipe(gulp.dest(config.sources.dest));
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

function csTests() {
    return gulp
        .src(config.tests.files.all)
        .pipe(tslint(config.tslint))
        .pipe(tslint.report());    
}

function runTests() {
    return gulp
        .src(config.tests.specs.all)
        .pipe(jasmine(config.tests.jasmine.custom));
}

gulp.task('cs-src', csSource);
gulp.task('cs-tests', csTests);
gulp.task('cs', gulp.parallel(csSource, csTests));

gulp.task('compile-source', gulp.series(csSource, compileSource));
gulp.task('compile-tests', gulp.series(csTests, compileTests));
gulp.task('compile', gulp.parallel('compile-source', 'compile-tests'));

gulp.task('test', gulp.series('compile', runTests));

function compileSourceWatch() {
    return gulp
        .src(config.sources.files.all, { since: gulp.lastRun(compileSourceWatch)})
        .pipe(sourcemaps.init())
        .pipe(sources())
        .js
        .pipe(sourcemaps.write(config.sources.maps))
        .pipe(gulp.dest(config.sources.dest));
}

function compileTestsWatch() {
    var specs = filter(config.tests.filter);

    return stream({ objectMode: true }, 
            gulp.src(config.tests.files.all, { since: gulp.lastRun(compileSourceWatch) }),
            gulp.src(config.sources.files.all),
            gulp.src(config.typings))
        .pipe(sourcemaps.init())
        .pipe(tests())
        .js
        .pipe(specs)
        .pipe(sourcemaps.write(config.tests.maps))
        .pipe(gulp.dest(config.tests.dest));
}

function csSourceWatch() {
    return gulp
        .src(config.sources.files.all, { since: gulp.lastRun(csSourceWatch) })
        .pipe(tslint(config.tslint))
        .pipe(tslint.report());
}

function csTestsWatch() {
    return gulp
        .src(config.tests.files.all, { since: gulp.lastRun(csSourceWatch) })
        .pipe(tslint(config.tslint))
        .pipe(tslint.report());    
}

function runTestsWatch() {
    return gulp
        .src(config.tests.specs.all)
        .pipe(jasmine(config.tests.jasmine.default));
}

function watchSources() {
    return watcher(csSourceWatch, compileSourceWatch, runTestsWatch);
}

function watchTests() {
    return watcher(csTestsWatch, compileTestsWatch, runTests);
}

function watch() {
    gulp.watch(config.sources.files.all, watchSources);
    gulp.watch(config.tests.files.all, watchTests);
}

gulp.task('w', watch);

function styleCheck(file) {
    return gulp
        .src(file)
        .pipe(tslint(config.tslint))
        .pipe(tslint.report());
}

function tranclucate(file) {
    var path = require('path');
    var dir = path.dirname(file);
    
    return gulp
        .src(file)
        .pipe(sourcemaps.init())
        .pipe(sources())
        .js
        .pipe(sourcemaps.write(config.sources.maps))
        .pipe(gulp.dest(dir));
}

function precisely() {
    var anymatch = require('anymatch');
    var parserFiles = [
        "src/process/parse/**/*.ts"
    ];
    
    var sourceFiles = gulp.watch(config.sources.files.all);

    let verify = (path) => {
        if (anymatch(parserFiles, path)) {
            return watcher(() => {
                return styleCheck(path);
            },
            () => {
                return tranclucate(path);
            });
        }
    };

    sourceFiles.on('all', (e, path) => {
        util.log(util.colors.green(e) + ': ' + util.colors.bold(path));
    });

    [
        'add',
        'change',
        'unlink'
    ].forEach((e) => {
        sourceFiles.on(e, verify);
    });

    return sourceFiles;
}

gulp.task('watch', precisely);
