const gulp = require("gulp");
const fileInclude = require("gulp-file-include");

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
