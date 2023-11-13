const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const clean = require("gulp-clean");
const fs = require("fs");
const server = require("gulp-server-livereload");

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
    .pipe(sass())
    .pipe(gulp.dest("./dist/css"));
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
gulp.task('watch', function () {
  gulp.watch('./src/scss/*/*.scss', gulp.parallel('sass')); 
  gulp.watch('./src/**/*.html', gulp.parallel('html')); 
})

////////////////////////////////////////
// default task
////////////////////////////////////////
gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("html", "sass"),
    gulp.parallel("server", "watch"))
); 