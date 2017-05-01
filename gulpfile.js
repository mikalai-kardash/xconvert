var gulp = require('gulp');
var tslint = require('gulp-tslint');

function csSource() {
    return gulp
        .src('./src/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report());
}

function csTests() {
    return gulp
        .src('./spec/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report());    
}

gulp.task('cs-src', csSource);
gulp.task('cs-tests', csTests);
gulp.task('cs', gulp.parallel(csSource, csTests));