const { src, dest, watch, series, parallel } = require("gulp");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");

const files = {
  scssPath: "app/scss/**/*.scss",
  jsPath: "app/js/**/*.js",
  imagesPath: "app/images/*",
};

function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist"));
}

function imagesTask() {
  return src(files.imagesPath).pipe(imagemin()).pipe(dest("dist/img"));
}

function jsTask() {
  return src(files.jsPath)
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(dest("dist"));
}

const cbString = new Date().getTime();
function cacheBustTask() {
  return src(["./*.html"])
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(dest("."));
}

function watchTask() {
  watch([files.scssPath, files.jsPath], parallel(scssTask, jsTask));
}

exports.default = series(
  parallel(scssTask, jsTask),
  imagesTask,
  cacheBustTask,
  watchTask
);
