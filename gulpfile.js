var gulp = require('gulp');
var tslint = require('gulp-tslint');

function cs() {
    return gulp
        .src('./src/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report());
}

gulp.task('cs', cs);