let gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('clean', async function(){
  del.sync('dist')
})

gulp.task('scss', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
      browsers: ['last 8 versions']
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('css', function(){
  return gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/slick-carousel/slick/slick.css',
    'node_modules/animate.css/animate.css',
  ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/scss'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function(){
  return gulp.src('app/*.html')
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('script', function(){
  return gulp.src('app/js/*.js')
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function(){
  return gulp.src([
    'node_modules/slick-carousel/slick/slick.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "app/"
      }
  });
});

gulp.task('export', function(){
  let buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));

  let BuildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'));

  let BuildJs = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'));
    
  let BuildFonts = gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));

  let BuildImg = gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'));   
});

gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('app/*.html', gulp.parallel('html'))
  gulp.watch('app/js/*.js', gulp.parallel('script'))
});

gulp.task('build', gulp.series('clean', 'export'))

gulp.task('default', gulp.parallel('css', 'scss', 'js', 'browser-sync', 'watch'));
// Optimize images
function img() {
    return gulp.src('src/img//*')
        .pipe(imagemin([
            imgCompress({
                loops: 4,
                min: 70,
                max: 80,
                quality: 'high'
            }),
            imagemin.gifsicle(),
            imagemin.optipng(),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('build/img'));
}


// Функция на файлы HTML
function files() {
    return gulp.src(htmlFiles)
        // Прогоним через rigger
        .pipe(rigger())

        // Копирование HTML в папку build
        .pipe(gulp.dest('./build/'))
}


// Удалить всё в указанной папке
function clean() {
    return cleans(['build/*'])
}


// Просматривать файлы
function watch() {
    // Инициализация сервера
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });

    // Следить за CSS файлами
    gulp.watch('./src/css//*.css', styles);

    // Следить за JS файлами
    gulp.watch('./src/js//*.js', scripts);

    // Следить за HTML файлами
    gulp.watch("./src/*.html", files);
    gulp.watch("./src//*.html", files);

    // При изменении HTML запустить синхронизацию
    gulp.watch("./src/*.html").on('change', browserSync.reload);
    gulp.watch("./src/**/*.html").on('change', browserSync.reload);
}


// *************************************************************************************** //
// **************************************** Таски **************************************** //
// *************************************************************************************** //

// Таск вызывающий функцию styles
gulp.task('styles', styles);

// Таск вызывающий функцию scripts
gulp.task('scripts', scripts);

// Таск для очистки папки build
gulp.task('cleans', clean);

// Таск для копирование файлов в build
gulp.task('copyFiles', function () {
    return gulp.src(src.copy_files)
        // Прогоним через rigger
        .pipe(rigger())

        .pipe(gulp.dest(function (file) {
            let path = file.base;
            return path.replace('src', 'build');
        }));
});

// Таск для отслеживания изменений
gulp.task('watch', watch);

// Таск для удаления файлов в папке build и запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts, img, "copyFiles")));

// Таск запускает таск build и watch последовательно
gulp.task('dev', gulp.series('build', 'watch'));