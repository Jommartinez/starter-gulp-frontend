const { src, dest, series, watch } = require('gulp')
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');

// img src --> img dist
function imgMinify() {
    return src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(dest('dist/assets/images'))
        .pipe(browserSync.stream());
}

// Pug --> HTML
function html() {
    return src(['src/pug/*.pug', 'src/pug/**/*.pug', '!src/pug/layout*.pug', '!src/pug/partials/*.pug', '!src/pug/components/*.pug'])
        .pipe(pug({ pretty: true }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}

// scss --> css
function scss() {
    return src('src/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(sourcemaps.write('/'))
        .pipe(dest('dist/assets/css'))
        .pipe(browserSync.stream());
}

// jsES6 --> JS
function js() {
    return src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('/'))
        .pipe(dest('dist/assets/js'))
        .pipe(browserSync.stream());
}

// Watch
function watchCode() {
    browserSync.init({
        server: {
            //static server
            baseDir: "./dist"
            //dinamic server
            //proxy: "yourlocal.dev"
        }
    });

    watch('src/pug/**/*.pug', html);
    watch(['src/scss/**/*.scss', 'src/scss/*.scss'], scss);
    watch('src/js/*.js', js);
    watch('src/images/*', imgMinify);

    watch("dist/*.html").on("change", browserSync.reload);
    watch("dist/assets/css/*.css").on("change", browserSync.reload);
    watch("dist/assets/js/*.js").on("change", browserSync.reload);
    watch("dist/assets/images/*").on("change", browserSync.reload);
}

exports.images = series(imgMinify)
exports.css = series(scss)
exports.js = series(js)
exports.html = series(html)
exports.default = series(watchCode)