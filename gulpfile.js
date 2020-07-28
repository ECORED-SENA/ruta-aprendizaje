const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const prettify = require('gulp-prettify');
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();


const src = './source';
const pub = './public';

// VARIABLES
const paths = {
    sass: {
        src: `${src}/scss/main.scss`,
        dest: `${pub}/css`,
    },
    pug: {
        src: `${src}/pug/*.pug`,
        dest: `${pub}`,
    }
};

// COMPILAR PUG
gulp.task('pug', done => {
    gulp
        .src(paths.pug.src)
        // PREVIENE QUE LOS PROCESOS GULP.WATCH SE DETENGA AL ENCONTRAR UN ERROR
        .pipe(plumber())
        // COMPLIA PUG
        .pipe(
            pug({
                locals: {}
            })
        )
        // ENBELLECE EL HTML
        .pipe(prettify({ indent_size: 4 }))
        // GUARDA EL ARCHIVO HTML
        .pipe(gulp.dest(paths.pug.dest))
        // REFRESCADO DEL NAVEGADOR
        .pipe(browserSync.stream());
    done();
});

gulp.task("sass", function () {
  return gulp
      .src(paths.sass.src)
    .pipe(sass().on("error", sass.logError))
      .pipe(gulp.dest(paths.sass.dest));
});



gulp.task('servidor', done => {
    browserSync.init({
        server: pub,
        open: true,
        notify: true
    });
    done();
});


gulp.task('watch', done => {
    gulp.watch(paths.pug.src, gulp.series('pug'));
    gulp.watch(paths.sass.src, gulp.series('sass'));
    done();
});

gulp.task("default", gulp.series("pug", "sass", "servidor", "watch"));
