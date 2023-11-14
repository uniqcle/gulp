const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const clean = require("gulp-clean");
const fs = require("fs");
const server = require("gulp-server-livereload");
const sourceMaps = require("gulp-sourcemaps");
//const groupMedia = require("gulp-group-css-media-queries"); // вступает в конфликт с source maps
const plumber = require('gulp-plumber'); 
const notify = require('gulp-notify'); 
const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");

//optimization function
const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: "Error <%= error.message %>",
      sound: false,
    }),
  };
};

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
    .pipe(changed("./dist/"))
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(fileInclude(fileIncludeOptions))
    .pipe(gulp.dest("./dist/"));
});

////////////////////////////////////////
// компиляция scss
////////////////////////////////////////
gulp.task("sass", function () {
  return (
    gulp
      .src("./src/scss/*.scss")
      .pipe(changed("./dist/css/"))
      .pipe(plumber(plumberNotify("Styles")))
      .pipe(sourceMaps.init())
      .pipe(sass())
      //.pipe(groupMedia())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest("./dist/css"))
  );
});

////////////////////////////////////////
// copy images
////////////////////////////////////////
gulp.task("images", function () {
  return gulp
    .src("./src/imgs/**/*")
    .pipe(changed("./dist/imgs/"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("./dist/imgs/"));
});

////////////////////////////////////////
// copy fonts, files
////////////////////////////////////////
gulp.task("fonts", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./dist/fonts/"))
    .pipe(gulp.dest("./dist/fonts/"));
});

gulp.task("files", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./dist/files/"))
    .pipe(gulp.dest("./dist/files/"));
});

////////////////////////////////////////
// webpack js
////////////////////////////////////////
gulp.task("js", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./dist/js/"))
    .pipe(plumber(plumberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("./dist/js/"));
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
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts"));
  gulp.watch("./src/files/**/*", gulp.parallel("files"));
  gulp.watch("./src/js/**/*", gulp.parallel("js"));
});

////////////////////////////////////////
// default task
////////////////////////////////////////
gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("html", "sass", "images", "fonts", "files", "js"),
    gulp.parallel("server", "watch")
  )
); 