// node.js Packages / Dependencies
const gulp          = require('gulp');
const sass          = require('gulp-sass')(require('sass'));
const uglify        = require('gulp-uglify');
const rename        = require('gulp-rename');
const concat        = require('gulp-concat');
const cleanCSS      = require('gulp-clean-css');
const imageMin      = require('gulp-imagemin');
const pngQuint      = require('imagemin-pngquant');
const browserSync   = require('browser-sync').create();
const autoprefixer  = require('gulp-autoprefixer');
const jpgRecompress = require('imagemin-jpeg-recompress');
const clean         = require('gulp-clean');

// SCSS/CSS Task
gulp.task('sass', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});

// Minify CSS
gulp.task('minify-css', () => {
    return gulp.src('src/css/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});

// Minify JS
gulp.task('minify-js', function () {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'));
});

// Optimize Images
gulp.task('images', function() {
    return gulp.src('src/images/*')
        .pipe(imageMin([
            imageMin.gifsicle({ interlaced: true }),
            imageMin.mozjpeg({ quality: 75, progressive: true }),
            pngQuint(),
            imageMin.svgo()
        ]))
        .pipe(gulp.dest('dist/images'));
});

// Clean Dist
gulp.task('clean', function () {
    return gulp.src('dist', { allowEmpty: true, read: false })
        .pipe(clean());
});

// Build Task
gulp.task('build', gulp.series('clean', 'sass', 'minify-css', 'minify-js', 'images'));

// Default Task
gulp.task('default', gulp.series('build', function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('src/scss/**/*.scss', gulp.series('sass', 'minify-css'));
    gulp.watch('src/js/*.js', gulp.series('minify-js')).on('change', browserSync.reload);
    gulp.watch('*.html').on('change', browserSync.reload);
}));
