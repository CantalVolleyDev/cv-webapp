var gulp        = require('gulp'),
    plumber     = require('gulp-plumber'),
    less        = require('gulp-less'),
    concat      = require('gulp-concat'),
    util        = require('gulp-util'),
    clean       = require('gulp-clean'),
    sequence    = require('gulp-sequence'),
    cssmin      = require('gulp-cssmin'),
    uglify      = require('gulp-uglify'),
    shell       = require('gulp-shell'),
    htmlreplace = require('gulp-html-replace'),
    templates   = require('gulp-templatecache');

var currentDate = Date.now();
var devMode    = (util.env.dev || false),
    devWebMode = !devMode && (util.env.devweb || false);
var globals = {
  files: {
    minifiedCss: currentDate + '.min.css',
    minifiedJs: currentDate + '.min.js',
    cache: {
      librariesJs: 'libraries.js',
      templatesJs: 'templates.js',
      lodashBuildJs: 'lodash.build.js',
      librariesCss: 'libraries.css'
    },
    librariesJs: [
      'node_modules/moment/min/moment.min.js',
      'node_modules/moment/locale/fr.js',
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/angular/angular.min.js',
      'node_modules/angular-route/angular-route.min.js',
      'node_modules/dropzone/dist/min/dropzone.min.js',
      'node_modules/cropperjs/dist/cropper.min.js'
    ],
    librariesCss: [
      'node_modules/dropzone/dist/min/dropzone.min.css',
      'node_modules/cropperjs/dist/cropper.min.css'
    ]
  },
  paths: {
    dev: 'dev/',
    devweb: 'devweb/',
    src: 'dev/src/',
    services: 'dev/src/services/',
    resources: 'dev/resources/',
    release: 'release/',
    target: 'target/',
    cache: 'gulp-cache/'
  },
  utils: {
    lodashFunctions: [
      'filter', 'each', 'remove', 'find', 'groupBy', 'capitalize', 'sortByAll'
    ]
  }
};

var jsFiles = [
  globals.paths.src + 'app.js',
  globals.paths.services + '*.js'
];
if (devMode) {
  jsFiles.push('!' + globals.paths.services + 'DataServiceUrlProd.js');
  jsFiles.push('!' + globals.paths.services + 'DataServiceUrlDvtWeb.js');
} else if (devWebMode) {
  jsFiles.push('!' + globals.paths.services + 'DataServiceUrlProd.js');
  jsFiles.push('!' + globals.paths.services + 'DataServiceUrlDvt.js');
} else {
  jsFiles.push('!' + globals.paths.services + 'DataServiceUrlDvtWeb.js');
  jsFiles.push('!' + globals.paths.services + 'DataServiceUrlDvt.js');
}
globals.files.appJs = jsFiles.concat([
  globals.paths.src + 'apprun.js',
  globals.paths.cache + globals.files.cache.templatesJs,
  globals.paths.src + 'components/**/*.js',
  globals.paths.src + 'routes/**/*.js'
]);

var env = {
  destination: globals.paths.target + globals.paths.release
};
if (devMode) {
  env.destination = globals.paths.target + globals.paths.dev;
}
if (devWebMode) {
  env.destination = globals.paths.target + globals.paths.devweb;
}

gulp.task('target-clean', function() {
  return gulp.src(env.destination)
             .pipe(clean({force: true}));
});
gulp.task('cache-clean', function() {
  return gulp.src(globals.paths.cache)
             .pipe(clean({force: true}));
});

gulp.task('libraries-js-concat-cache', function() {
  return gulp.src(globals.files.librariesJs.concat([globals.paths.cache + globals.files.cache.lodashBuildJs]))
             .pipe(concat(globals.files.cache.librariesJs))
             .pipe(uglify())
             .pipe(gulp.dest(globals.paths.cache));
;});
gulp.task('libraries-css-concat-cache', function() {
  return gulp.src(globals.files.librariesCss)
             .pipe(concat(globals.files.cache.librariesCss))
             .pipe(gulp.dest(globals.paths.cache));
;});

gulp.task('less-compile', function() {
  return gulp.src(globals.paths.src + 'app.less')
             .pipe(plumber())
             .pipe(less())
             .pipe(concat(globals.files.minifiedCss))
             .pipe(gulp.dest(env.destination));
});

gulp.task('css-minify', function() {
  return gulp.src([
                globals.paths.cache + globals.files.cache.librariesCss, 
                env.destination + globals.files.minifiedCss
             ])
             .pipe(concat(globals.files.minifiedCss))
             .pipe(cssmin())
             .pipe(gulp.dest(env.destination));
;});

gulp.task('templates-build', function() {
  return gulp.src([globals.paths.dev + '**/*.html', '!' + globals.paths.dev + 'index.html'])
             .pipe(templates({
                output: globals.files.cache.templatesJs, 
                strip: __dirname + '/' + globals.paths.dev,
                moduleName: 'cv-webapp', 
                minify: {
                  removeComments: true,
                  collapseWhitespace: true
                }
             }))
             .pipe(gulp.dest(globals.paths.cache));
});

gulp.task('lodash-build', shell.task([
  'lodash include=' + globals.utils.lodashFunctions.join(',') + 
  ' --output ./' + globals.paths.cache + globals.files.cache.lodashBuildJs + ' --production'
]));

gulp.task('js-uglify', function() {
  return gulp.src(globals.files.appJs)
             .pipe(concat(globals.files.minifiedJs))
             .pipe(uglify())
             .pipe(gulp.dest(env.destination));
});

gulp.task('js-concat', function() {
  return gulp.src([
                globals.paths.cache + globals.files.cache.librariesJs, 
                env.destination + globals.files.minifiedJs
             ])
             .pipe(concat(globals.files.minifiedJs))
             .pipe(gulp.dest(env.destination));
;});

gulp.task('html-replace', function() {
  return gulp.src(globals.paths.dev + 'index.html')
             .pipe(htmlreplace({
                css: globals.files.minifiedCss,
                js: globals.files.minifiedJs
             }))
             .pipe(gulp.dest(env.destination));
});

gulp.task('images-copy', function() {
  return gulp.src(globals.paths.resources + 'images/**/*.*')
             .pipe(gulp.dest(env.destination + 'images'));
});

gulp.task('fonts-copy', function() {
  return gulp.src(['node_modules/bootstrap/dist/fonts/**/*.*', globals.paths.resources + 'fonts/**/*.*'])
             .pipe(gulp.dest(env.destination + 'fonts'));
});

gulp.task('fullbuild', function(callback) {
  sequence(
    ['target-clean', 'templates-build', 'cache-clean'],
    ['lodash-build'],
    ['libraries-js-concat-cache', 'libraries-css-concat-cache'],
    ['less-compile', 'html-replace', 'js-uglify'],
    ['css-minify', 'js-concat', 'images-copy', 'fonts-copy']
  )(callback);
});

gulp.task('build', function(callback) {
  sequence(
    ['target-clean', 'templates-build'],
    ['less-compile', 'html-replace', 'js-uglify'],
    ['css-minify', 'js-concat', 'images-copy', 'fonts-copy']
  )(callback);
});

gulp.task('watch', function() {
  gulp.watch([globals.paths.dev + '**/*.less'], ['build']);
  gulp.watch([globals.paths.dev + '**/*.html'], ['build']);
  gulp.watch([globals.paths.dev + '**/*.js'], ['build']);
});

//gulp.task('compile-less', function() {
//  return gulp.src('./dev/**/*.less')
//             .pipe(plumber())
//             .pipe(less())
//             .pipe(gulp.dest('./src'));
//});
//
//gulp.task('templates-copy', function() {
//  return gulp.src('./dev/**/*.html')
//             .pipe(gulp.dest('./src'));
//});
//
//gulp.task('fonts-copy', function() {
//  return gulp.src('./node_modules/bootstrap/fonts/*.*')
//             .pipe(gulp.dest('./src/fonts'));
//});
//
//gulp.task('watch', function() {
//  gulp.watch('./dev/**/*.less', ['compile-less', 'fonts-copy']);
//  gulp.watch('./dev/**/*.ts'  , ['compile-ts']);
//  gulp.watch('./dev/**/*.html', ['templates-copy']);
//});
//
//gulp.task('default', ['watch']);