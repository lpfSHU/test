/**
 * Created by lipengfei on 2017/4/17.
 */
var gulp = require('gulp');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var babel = require("gulp-babel");

gulp.task('task', function () {
    "use strict";
    var jsFilter = filter('**/*.js', {restore: true});
    var cssFilter = filter('**/*.css', {restore: true});
    var indexHtmlFilter = filter(['**/*', '!index.html'], {restore: true});

    return gulp.src('index.html')
        .pipe(useref())
        .pipe(jsFilter)
        .pipe(babel())
        .pipe(uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(autoprefixer(
            {
                browsers: ['> 5%'],
                cascade: false, //是否美化属性值 默认：true 像这样：
                //-webkit-transform: rotate(45deg);
                //        transform: rotate(45deg);
                remove: true //是否去掉不必要的前缀 默认：true
            }
        ))
        .pipe(csso())
        .pipe(cssFilter.restore)
        .pipe(indexHtmlFilter)
        .pipe(rev())
        .pipe(indexHtmlFilter.restore)
        .pipe(revReplace())
        .pipe(gulp.dest('dist'));
});

var browserSync = require('browser-sync').create();
// 静态服务器
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    // gulp.watch("*.html", ['watch']);
    gulp.watch(["*.html", "js/**/*.js", "css/**/*.css", "html/**/*.html"]).on('change', browserSync.reload);
});


// gulp.task('browser-sync', function() {
//     browserSync.init({
//         proxy: "你的域名或IP"
//     });
// });

//将ES6代码编译成ES5
// var babel = require('gulp-babel');
// gulp.task('babel', function () {
//     return gulp.src('./js/index.js')
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(gulp.dest('./dist'));
// });

