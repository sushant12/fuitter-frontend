var gulp = require('gulp');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mq4HoverShim = require('mq4-hover-shim');
var rimraf = require('rimraf').sync;
var browser = require('browser-sync');
var panini = require('panini');
var concat = require('gulp-concat');
var port = process.env.SERVER_PORT || 8080;
var nodepath =  'node_modules/';
var assetspath =  'assets/';

// Starts a BrowerSync instance
gulp.task('server', ['build'], function(){
    browser.init({server: './_site', port: port});
});

// Watch files for changes
gulp.task('watch', function() {
    gulp.watch('scss/**/*', ['compile-scss', browser.reload]);
    gulp.watch('sass/**/*', ['compile-sass', browser.reload]);
    gulp.watch('js/**/*', ['copy-js', browser.reload]);
    gulp.watch('images/**/*', ['copy-images', browser.reload]);
    gulp.watch('html/pages/**/*', ['compile-html']);
    gulp.watch(['html/{layouts,includes,helpers,data}/**/*'], ['compile-html:reset','compile-html']);
    gulp.watch(['./src/{layouts,partials,helpers,data}/**/*'], [panini.refresh]);
});

// Erases the dist folder
gulp.task('reset', function() {
    rimraf('bulma/*');
    rimraf('scss/*');
    rimraf('assets/css/*');
    rimraf('assets/fonts/*');
    rimraf('images/*');
});

// Erases the dist folder
gulp.task('clean', function() {
    rimraf('_site');
});

// Copy Bulma filed into Bulma development folder
gulp.task('setupBulma', function() {
    //Get Bulma from node modules
    gulp.src([nodepath + 'bulma/*.sass']).pipe(gulp.dest('bulma/'));
    gulp.src([nodepath + 'bulma/**/*.sass']).pipe(gulp.dest('bulma/'));
});

// Copy assets
gulp.task('copy', function() {
    //Copy other external css assets
    gulp.src(['assets/css/*.css']).pipe(gulp.dest('_site/assets/css/'));
    //Copy other external font assets
    gulp.src(['assets/fonts/**/*']).pipe(gulp.dest('_site/assets/fonts/'));
    gulp.src([nodepath + 'wickedpicker/fonts/**/*']).pipe(gulp.dest('_site/assets/js/wickedpicker/fonts/'));
    gulp.src([nodepath + 'datedropper/dd-icon/**/*']).pipe(gulp.dest('_site/assets/css/dd-icon/'));
    gulp.src([nodepath + 'wickedpicker/fonts/**/*']).pipe(gulp.dest('_site/assets/fonts/'));
    gulp.src([assetspath + 'css/font/**/*',]).pipe(gulp.dest('_site/assets/css/font/'));
});

//Theme Sass variables
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed',
    includePaths: [nodepath + 'bulma/sass']
};

//Theme Scss variables
var scssOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed',
    includePaths: ['./scss/partials']
};

// Compile Bulma Sass
gulp.task('compile-sass', function () {
    var processors = [
        mq4HoverShim.postprocessorFor({ hoverSelectorPrefix: '.is-true-hover ' }),
        autoprefixer({
            browsers: [
                "Chrome >= 45",
                "Firefox ESR",
                "Edge >= 12",
                "Explorer >= 10",
                "iOS >= 9",
                "Safari >= 9",
                "Android >= 4.4",
                "Opera >= 30"
            ]
        })//,
        //cssnano(),
    ];
    //Watch me get Sassy
    return gulp.src('./bulma/bulma.sass')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./_site/assets/css/'));
});

// Compile Theme Scss
gulp.task('compile-scss', function () {
    var processors = [
        mq4HoverShim.postprocessorFor({ hoverSelectorPrefix: '.is-true-hover ' }),
        autoprefixer({
            browsers: [
                "Chrome >= 45",
                "Firefox ESR",
                "Edge >= 12",
                "Explorer >= 10",
                "iOS >= 9",
                "Safari >= 9",
                "Android >= 4.4",
                "Opera >= 30"
            ]
        })//,
        //cssnano(),
    ];
    //Watch me get Sassy
    return gulp.src('./scss/dashboard.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./_site/assets/css/'));
});

// Compile Html
gulp.task('compile-html', function() {
    gulp.src('html/pages/**/*.html')
        .pipe(panini({
        root: 'html/pages/',
        layouts: 'html/layouts/',
        partials: 'html/includes/',
        helpers: 'html/helpers/',
        data: 'html/data/'
    }))
        .pipe(gulp.dest('_site'))
        .on('finish', browser.reload);
});

gulp.task('compile-html:reset', function(done) {
    panini.refresh();
    done();
});

// Compile css from node modules
gulp.task('compile-css', function() {
    return gulp.src([
        nodepath + 'izitoast/dist/css/iziToast.min.css',
        nodepath + 'wickedpicker/dist/wickedpicker.min.css',
        nodepath + 'billboard.js/dist/billboard.min.css',
        nodepath + 'jqvmap/dist/jqvmap.min.css',
        nodepath + 'dragula/dist/dragula.min.css',
        //Additional static css assets
        assetspath + 'css/icons.min.css',
        assetspath + 'css/datepicker/datepicker.css',
        assetspath + 'css/chosen/chosen.css',
        assetspath + 'js/fileuploader/jquery.fileuploader.min.css',
        assetspath + 'css/summernote/summernote-lite.css',
        nodepath + 'jquery-ui-dist/jquery-ui.min.css',
    ])
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./_site/assets/css/'));
});

// Compile js from node modules
gulp.task('compile-js', function() {
    return gulp.src([
        nodepath + 'jquery/dist/jquery.min.js',
        nodepath + 'jquery-ui-dist/jquery-ui.min.js',
        nodepath + 'peity/jquery.peity.min.js',
        nodepath + 'izitoast/dist/js/iziToast.min.js',
        nodepath + 'chosen-js/chosen.jquery.min.js',
        nodepath + '@fengyuanchen/datepicker/dist/datepicker.min.js',
        nodepath + 'wickedpicker/dist/wickedpicker.min.js',
        nodepath + 'd3/dist/d3.min.js',
        nodepath + 'billboard.js/dist/billboard.min.js',
        nodepath + 'chart.js/dist/Chart.bundle.min.js',
        nodepath + 'jqvmap/dist/jquery.vmap.min.js',
        nodepath + 'jqvmap/dist/maps/jquery.vmap.usa.js',
        nodepath + 'jqvmap/dist/data/jquery.vmap.sampledata.js',
        nodepath + 'dragula/dist/dragula.min.js',
        //Additional static js assets
        assetspath + 'js/ggpopover/ggpopover.min.js',
        assetspath + 'js/ggpopover/ggtooltip.js',
        assetspath + 'js/datatable/datatable.min.js',
        assetspath + 'js/fileuploader/jquery.fileuploader.min.js',
        assetspath + 'js/summernote/summernote-lite.js',
    ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./_site/assets/js/'));
});

//Copy Theme js to production site
gulp.task('copy-js', function() {
    gulp.src('js/**/*.js')
        .pipe(gulp.dest('./_site/assets/js/'));
});

//Copy images to production site
gulp.task('copy-images', function() {
    gulp.src('images/**/*')
        .pipe(gulp.dest('./_site/assets/images/'));
});

gulp.task('init', ['setupBulma']);
gulp.task('build', ['clean','copy', 'compile-css', 'compile-js', 'copy-js', 'compile-sass', 'compile-scss', 'compile-html', 'copy-images']);
gulp.task('default', ['server', 'watch']);
