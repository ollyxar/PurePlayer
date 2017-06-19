const gulp = require('gulp');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');

gulp.task('compress-js', () => {
    return gulp.src('src/js/*.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('dist/js'));

});

gulp.task('compress-css', () => {
    return gulp.src('src/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('compress-img', () =>
    gulp.src('src/img/*')
        .pipe(imagemin([imagemin.optipng({optimizationLevel: 5})]))
        .pipe(gulp.dest('dist/img'))
);

gulp.task('default', ['compress-css', 'compress-js', 'compress-img']);