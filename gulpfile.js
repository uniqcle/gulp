const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const clean = require("gulp-clean");
const fs = require("fs");
const server = require("gulp-server-livereload");
const sourceMaps = require("gulp-sourcemaps");
const groupMedia = require("gulp-group-css-media-queries"); // вступает в конфликт с source maps

////////////////////////////////////////
// clear dist folder
////////////////////////////////////////
gulp.task("clean", function (done) {
  if (fs.existsSync("./dist/")) {
    return gulp.src("./dist/", { read: false }).pipe(clean({ force: true }));
  }
  done();
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
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(groupMedia())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./dist/css"));
});

////////////////////////////////////////
// copy images
////////////////////////////////////////
gulp.task("images", function () {
  return gulp.src("./src/imgs/**/*").pipe(gulp.dest("./dist/imgs/"));
});

////////////////////////////////////////
// старт лайв сервера
////////////////////////////////////////
gulp.task("server", function () {
  return gulp.src("./dist/").pipe(
    server({
      livereload: true,
      open: true,
    })
  );
});

////////////////////////////////////////
// watch task
////////////////////////////////////////
gulp.task("watch", function () {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass"));
  gulp.watch("./src/**/*.html", gulp.parallel("html"));
  gulp.watch("./src/imgs/**/*", gulp.parallel("images"));
});

////////////////////////////////////////
// default task
////////////////////////////////////////
gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("html", "sass", "images"),
    gulp.parallel("server", "watch")
  )
); 