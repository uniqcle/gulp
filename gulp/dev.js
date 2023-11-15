const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const clean = require("gulp-clean");
const fs = require("fs");
const server = require("gulp-server-livereload");
const sourceMaps = require("gulp-sourcemaps");
const groupMedia = require("gulp-group-css-media-queries");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");
var sassGlob = require("gulp-sass-glob");

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
// clear build folder
////////////////////////////////////////
gulp.task("clean:dev", function (done) {
  if (fs.existsSync("./build/")) {
    return gulp.src("./build/", { read: false }).pipe(clean({ force: true }));
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

gulp.task("html:dev", function () {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(changed("./build/", { hasChanged: changed.compareContents }))
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(fileInclude(fileIncludeOptions))
    .pipe(gulp.dest("./build/"));
});

////////////////////////////////////////
// компиляция scss
////////////////////////////////////////
gulp.task("sass:dev", function () {
  return (
    gulp
      .src("./src/scss/*.scss")
      .pipe(changed("./build/css/"))
      .pipe(plumber(plumberNotify("Styles")))
      .pipe(sourceMaps.init())
      .pipe(sassGlob())
      // .pipe(groupMedia())
      .pipe(sass())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest("./build/css"))
  );
});

////////////////////////////////////////
// copy images
////////////////////////////////////////
gulp.task("images:dev", function () {
  return gulp
    .src("./src/imgs/**/*")
    .pipe(changed("./build/imgs/"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("./build/imgs/"));
});

////////////////////////////////////////
// copy fonts, files
////////////////////////////////////////
gulp.task("fonts:dev", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./build/fonts/"))
    .pipe(gulp.dest("./build/fonts/"));
});

gulp.task("files:dev", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./build/files/"))
    .pipe(gulp.dest("./build/files/"));
});

////////////////////////////////////////
// webpack js
////////////////////////////////////////
gulp.task("js:dev", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./build/js/"))
    .pipe(plumber(plumberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(require("./../webpack.config.js")))
    .pipe(gulp.dest("./build/js/"));
});

////////////////////////////////////////
// старт лайв сервера
////////////////////////////////////////
gulp.task("server:dev", function () {
  return gulp.src("./build/").pipe(
    server({
      livereload: true,
      open: true,
    })
  );
});

////////////////////////////////////////
// watch task
////////////////////////////////////////
gulp.task("watch:dev", function () {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:dev"));
  gulp.watch("./src/**/*.html", gulp.parallel("html:dev"));
  gulp.watch("./src/imgs/**/*", gulp.parallel("images:dev"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts:dev"));
  gulp.watch("./src/files/**/*", gulp.parallel("files:dev"));
  gulp.watch("./src/js/**/*", gulp.parallel("js:dev"));
});
