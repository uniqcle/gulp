const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const clean = require("gulp-clean");
const fs = require("fs");

////////////////////////////////////////
// clear dist folder
////////////////////////////////////////
gulp.task("clear", function (done) {
  if (fs.existsSync("./dist/")) {
    return gulp.src("./dist/", { read: false }).pipe(clean({ force: true }));
  }
});

////////////////////////////////////////
// индклудинг html файлов
////////////////////////////////////////
const fileIncludeOptions = {
  prefix: "@@",
  basepath: "@file",
};

gulp.task("html", function () {
  return gulp
    .src("./src/*.html")
    .pipe(fileInclude(fileIncludeOptions))
    .pipe(gulp.dest("./dist/"));
});

////////////////////////////////////////
// компиляция scss
////////////////////////////////////////
gulp.task("sass", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dist/css"));
});