var gulp = require('gulp');
var filter = require('gulp-filter');
var tslint = require('gulp-tslint');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
var print = require('gulp-print');

var sources = tsc.createProject('tsconfig.json');
var tests = tsc.createProject('tsconfig.json');

function compileSource() {
    var result = gulp
        .src('./src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(sources());

    return result
        .js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/'));
}

function compileTests() {
    var result = gulp
        .src([
            './src/**/*.ts',
            './spec/**/*.ts',
            './typings/index.d.ts'
        ])
        .pipe(sourcemaps.init())
        .pipe(tests());

    var specs = filter([ 'spec\\*' ]);

    return result
        .js
        .pipe(specs)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./spec/'));
}

function csSource() {
    return gulp
        .src('./src/**/*.ts')
        .pipe(tslint({
            formatter: "prose"
        }))
        .pipe(tslint.report());
}

function csTests() {
    return gulp
        .src('./spec/**/*.ts')
        .pipe(tslint({
            formatter: "prose"
        }))
        .pipe(tslint.report());    
}

function runTests() {
    return gulp
        .src('./spec/**/*.spec.js')
        .pipe(jasmine({
            reporter: new SpecReporter({
                spec: {
                    displayPending: true
                }
            })
        }));
}

gulp.task('cs-src', csSource);
gulp.task('cs-tests', csTests);
gulp.task('cs', gulp.parallel(csSource, csTests));

gulp.task('compile-source', gulp.series(csSource, compileSource));
gulp.task('compile-tests', gulp.series(csTests, compileTests));
gulp.task('compile', gulp.parallel('compile-source', 'compile-tests'));

gulp.task('test', gulp.series('compile', runTests));
