const gulp = require("gulp");

//html
const fileInclude = require("gulp-file-include");
const htmlclean = require("gulp-htmlclean");
const webpHTML = require("gulp-webp-html");

//sass
const sass = require("gulp-sass")(require("sass"));
var sassGlob = require("gulp-sass-glob");
const sourceMaps = require("gulp-sourcemaps");
//const groupMedia = require("gulp-group-css-media-queries"); // вступает в конфликт с source maps
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");

//images
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");

//js
const webpack = require("webpack-stream");
const babel = require("gulp-babel");

const clean = require("gulp-clean");
const fs = require("fs");
const server = require("gulp-server-livereload");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
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
// clear docs folder
////////////////////////////////////////
gulp.task("clean:docs", function (done) {
  if (fs.existsSync("./docs/")) {
    return gulp.src("./docs/", { read: false }).pipe(clean({ force: true }));
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

gulp.task("html:docs", function () {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(changed("./docs/"))
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(fileInclude(fileIncludeOptions))
    .pipe(webpHTML())
    .pipe(htmlclean())
    .pipe(gulp.dest("./docs/"));
});

////////////////////////////////////////
// компиляция scss
////////////////////////////////////////
gulp.task("sass:docs", function () {
  return (
    gulp
      .src("./src/scss/*.scss")
      .pipe(changed("./docs/css/"))
      .pipe(plumber(plumberNotify("Styles")))
      .pipe(sourceMaps.init())
      .pipe(autoprefixer())
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(csso())
      //.pipe(groupMedia())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest("./docs/css"))
  );
});

////////////////////////////////////////
// copy images
////////////////////////////////////////
gulp.task("images:docs", function () {
  return gulp
    .src("./src/imgs/**/*")
    .pipe(changed("./docs/imgs/"))
    .pipe(webp())
    .pipe(gulp.dest("./docs/imgs/"))
    .pipe(gulp.src("./src/imgs/**/*"))
    .pipe(changed("./docs/imgs/"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("./docs/imgs/"));
});

////////////////////////////////////////
// copy fonts, files
////////////////////////////////////////
gulp.task("fonts:docs", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./docs/fonts/"))
    .pipe(gulp.dest("./docs/fonts/"));
});

gulp.task("files:docs", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./docs/files/"))
    .pipe(gulp.dest("./docs/files/"));
});

////////////////////////////////////////
// webpack js
////////////////////////////////////////
gulp.task("js:docs", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./docs/js/"))
    .pipe(plumber(plumberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(require("../webpack.config.js")))
    .pipe(gulp.dest("./docs/js/"));
});

////////////////////////////////////////
// старт лайв сервера
////////////////////////////////////////
gulp.task("server:docs", function () {
  return gulp.src("./docs/").pipe(
    server({
      livereload: true,
      open: true,
    })
  );
});

////////////////////////////////////////
// watch task. Смысл таска нет. 
////////////////////////////////////////
// gulp.task("watch:docs", function () {
//   gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:docs"));
//   gulp.watch("./src/**/*.html", gulp.parallel("html:docs"));
//   gulp.watch("./src/imgs/**/*", gulp.parallel("images:docs"));
//   gulp.watch("./src/fonts/**/*", gulp.parallel("fonts:docs"));
//   gulp.watch("./src/files/**/*", gulp.parallel("files:docs"));
//   gulp.watch("./src/js/**/*", gulp.parallel("js:docs"));
// });
