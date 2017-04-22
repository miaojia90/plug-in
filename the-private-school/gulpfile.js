var gulp = require('gulp');
var sass = require('gulp-sass');
var mincss = require('gulp-minify-css');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var clean = require('gulp-clean');

var sourcemaps = require("gulp-sourcemaps");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var replace = require('gulp-str-replace');
var imagemin = require('gulp-imagemin');

//自动刷新     
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var fs = require('fs');
var fileContent = fs.readFileSync('./package.json');
var jsonObj = JSON.parse(fileContent);
var autoprefixer = require('gulp-autoprefixer');

/* 基础路径 */
var paths = {
  css       :  'css/',
  sass      :  'css/',
  scripts   :  "js/",
  img       :  "img/",
  build     :  "build/"
}

var resProxy = "";

// 先清理文件
gulp.task('clean',function(){
    return gulp.src([paths.build + '**/*.css',paths.build+'**/*.html',paths.build+'**/*.js'])
             .pipe(clean());
});
gulp.task('sass', ['clean'],function () {
  return gulp.src([paths.sass + '**/*.scss']) 
           .pipe(sass())
           .pipe(autoprefixer({
               browsers: ['last 5 versions', 'Android >= 4.0'],
                   cascade: true, //是否美化属性值 默认：true 像这样：
              //-webkit-transform: rotate(45deg);
                    //        transform: rotate(45deg);
                  remove:true //是否去掉不必要的前缀 默认：true 
           }))
           .pipe(replace({
              original : {
                  resProxy : /\@{3}RESPREFIX\@{3}/g
                },
                target : {
                  resProxy : resProxy
                }
            }))
           .pipe(concat('style.css'))
           .pipe(mincss())
           .pipe(gulp.dest(paths.build + "/css"))
           .pipe(reload({stream:true}));
});

// 监听html文件的改变
gulp.task('html',function(){
    return gulp.src("*.html")
      .pipe(replace({
          original : {
              resProxy : /\@{3}RESPREFIX\@{3}/g
            },
            target : {
              resProxy : resProxy
            }
      }))
      .pipe(gulp.dest(paths.build))
      .pipe(reload({stream:true})); 
});

// 对图片进行压缩
gulp.task('images',function(){
   return gulp.src([paths.img + "**/*.jpg",paths.img + "**/*.png"])
          .pipe(imagemin())
          .pipe(gulp.dest(paths.build + "/img"));
});

//压缩,合并 js
// 合并、压缩js文件
gulp.task('js', function() {
  return gulp.src(paths.scripts+'**/*.js')
    .pipe(gulp.dest(paths.build+'/js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.build + "/js"));
});

// 创建本地服务器，并且实时更新页面文件
gulp.task('browser-sync', ['sass','html'],function() {
    var files = [
      '**/*.html',
      '**/*.css',
      '**/*.scss',
      '**/*.js'
    ]; 
    browserSync.init(files,{
        server: {
            // baseDir: './'
        }
        
    });
});


gulp.task('default',['sass','html','images','js'],function () {
    gulp.watch(["**/*.scss","**/*.css"], ['sass']);
    gulp.watch("**/*.html", ['html']);
});

gulp.task('server', ['browser-sync','sass','html','images','js'],function () {
    gulp.watch(["**/*.scss","**/*.css"], ['sass']);
    gulp.watch("**/*.html", ['html']);
});