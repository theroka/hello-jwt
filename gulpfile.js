const gulp = require("gulp");
const ts = require("gulp-typescript");
const browserify = require("gulp-browserify");
const rename = require("gulp-rename");

let project = ts.createProject("tsconfig.json");

// transpile TypeScript to ES5 / CommonJS
gulp.task("build", function() {
  return project
    .src()
    .pipe(project())
    .js.pipe(gulp.dest("build"));
});

// bundle ES5 / CommonJS into single UMD for browser
gulp.task("public", function() {
  return gulp
    .src("build/public/index.js")
    .pipe(browserify())
    .pipe(rename("bundle.js"))
    .pipe(gulp.dest("build/public/"));
});

// bundle ES5 / CommonJS into single UMD for browser
gulp.task("protected", function() {
  return gulp
    .src("build/protected/index.js")
    .pipe(browserify())
    .pipe(rename("bundle.js"))
    .pipe(gulp.dest("build/protected/"));
});

// copy static asserts to build folder
gulp.task("assets", function() {
  return gulp
    .src(["src/static/styles.css" ], {
      base: "src/"
    })
    .pipe(gulp.dest("build/"));
});

gulp.task("default", gulp.series("build", "public", "protected", "assets"));
