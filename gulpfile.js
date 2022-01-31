'use strict';

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins({});

var lintAssets = [
    'server/**/*.js',

];
//'config/**/*.js',

// ESLint JS linting task

gulp.task('lint', function () {
    return gulp.src(lintAssets)
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failAfterError());
});

// ESLint JS linting task
gulp.task('lint-fix', function () {
    return gulp.src(lintAssets)
        .pipe(plugins.eslint({fix: true}))
        .pipe(plugins.eslint.format());
});
gulp.task('dev-start', function () {
    return plugins.nodemon({
        script: 'server.js',
        ext: 'js,html',
        watch: ['server/**/*.js', 'server.js', 'views/**/*.html', 'config/**/*.js', 'lib/**/*.js']
    });
});

var babel = require('gulp-babel');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var ngAnnotate = require('gulp-ng-annotate')
var gutil = require('gulp-util');
var pump = require('pump');

gulp.task('minify_js', function (cb) {
    pump([gulp.src([
            'public/s_js/libs/imagesloaded.pkgd.min.js',
            'public/s_js/libs/bootstrap.min.js',
            'public/s_js/libs/jquery.flexslider-min.js',
            'public/s_js/panzoom.js',
            'public/s_js/libs/moment.min.js',
            'public/s_js/libs/jquery.mCustomScrollbar.concat.min.js',

            <!-- angular -->
            'public/s_js/libs/angular.js',
            'public/s_js/libs/angular-messages.js',
            'public/s_js/libs/angular-sanitize.min.js',
            'public/s_js/libs/angular-route.min.js',
            'public/scripts/lib/angular-slugify.js',
            'public/s_js/libs/angular-cookies.min.js',
            'public/s_js/libs/angular-moment.min.js',
            'public/s_js/libs/angular-toastr.tpls.js',
            <!-- flex -->
            'public/scripts/lib/ui-bootstrap-tpls-2.5.0.js',
            <!-- services -->

            "public/assets/controller/startpoint.js",
            "public/assets/services/search.factory.js",
            "public/assets/services/searchCount.factory.js",  <!-- giving similiar items -->
            "public/assets/services/authentication.service.js",
            "public/assets/services/mappedcategory.factory.js",
            "public/assets/services/twotap.factory.js",
            "public/assets/services/user.service.js",
            "public/assets/services/socialProduct.service.js",
            "public/assets/services/setRequiredFieldUserCart.js",
             "public/assets/services/brandprosperents.factory.js",
			 "public/assets/services/categoryStringSelect.factory.js",

            <!-- controllers -->
            "public/assets/controller/app_home.js",
            "public/assets/controller/homecontroller.js",
            "public/assets/controller/dashcontroller.js",
            "public/assets/controller/apicatalogctrl.js",
            "public/assets/controller/searchingcontroller.js",
            "public/assets/controller/customizetopshopcontroller.js",
            "public/assets/controller/account.controller.js",
            "public/assets/controller/catalog_cart_controller.js",
            "public/assets/controller/catalog_cart_controller_checkout.js",
            "public/assets/controller/confirmcontroller.js",
            "public/assets/controller/mailcontroller.js",
            "public/assets/controller/orderhistorycontroller.js",
            "public/assets/controller/blogcontroller.js",
            "public/assets/controller/collective.controller.js",
            "public/assets/controller/blogSigninController.js",
            <!-- directive -->
            "public/assets/directive/slider.directive.js",
            "public/assets/directive/mainSearch.directive.js",
            "public/assets/directive/socialProduct.directive.js",
            "public/assets/directive/signUser.directive.js",
            "public/assets/directive/userSidebar.directive.js",
            "public/assets/directive/profileSidebar.directive.js",

            "public/assets/directive/validators.directive.js",
            "public/assets/directive/photoUpload.directive.js",
            "public/assets/directive/convertNumber.directive.js",
            "public/assets/directive/zoom.directive.js",

            <!-- filter -->
            "public/assets/filter/cardvalidate.js",
            "public/assets/filter/alphabetfilter.js",
            "public/assets/controller/user.controller.js",
            <!-- dot dot dot -->
            'public/scripts/lib/ng-file-upload-shim.min.js',
            'public/scripts/lib/ng-file-upload.min.js',
            "public/vendor/jQuery-Facebook-Photo-Selector/csphotoselector.js",
            "public/s_js/libs/angular-animate.min.js",
            "public/scripts/lib/ng-img-crop.js",
            "public/s_js/libs/angular-resource.min.js",
            "public/s_js/jsapi.js",
            "public/s_js/socialPopup.js"

        ]),
            ngAnnotate(),
            concat('front.js'),
            gulp.dest('public/dist'),
            rename('front.min.js'),
            uglify().on('error', gutil.log),
            gulp.dest('public/dist')
        ]
    );

    pump([gulp.src([
            'public/s_js/libs/imagesloaded.pkgd.min.js',
            'public/s_js/libs/bootstrap.min.js',
            'public/s_js/libs/jquery.flexslider-min.js',
            'public/s_js/panzoom.js',
            'public/s_js/libs/moment.min.js',
            'public/s_js/libs/jquery.mCustomScrollbar.concat.min.js',

            <!-- angular -->
            'public/s_js/libs/angular.js',
            'public/s_js/libs/angular-messages.js',
            'public/s_js/libs/angular-sanitize.min.js',
            'public/s_js/libs/angular-route.min.js',
            'public/scripts/lib/angular-slugify.js',
            'public/s_js/libs/angular-cookies.min.js',
            'public/s_js/libs/angular-moment.min.js',
            'public/s_js/libs/angular-toastr.tpls.js',
            <!-- flex -->
            'public/scripts/lib/ui-bootstrap-tpls-2.5.0.js',
            <!-- services -->

            "public/assets/controller/startpoint.js",
            "public/assets/services/search.factory.js",
            "public/assets/services/searchCount.factory.js",  <!-- giving similiar items -->
            "public/assets/services/authentication.service.js",
            "public/assets/services/mappedcategory.factory.js",
            "public/assets/services/twotap.factory.js",
            "public/assets/services/user.service.js",
            "public/assets/services/socialProduct.service.js",
            "public/assets/services/setRequiredFieldUserCart.js",
            "public/assets/services/brandprosperents.factory.js",
            <!-- controllers -->
            "public/assets/controller/app_home.js",
            "public/assets/controller/homecontroller.js",
            "public/assets/controller/searchingcontroller.js",
            <!-- directive -->
            "public/assets/directive/slider.directive.js",
            "public/assets/directive/mainSearch.directive.js",
            "public/assets/directive/socialProduct.directive.js",
            "public/assets/directive/signUser.directive.js",
            "public/assets/directive/userSidebar.directive.js",
            "public/assets/directive/profileSidebar.directive.js",

            "public/assets/directive/validators.directive.js",
            "public/assets/directive/photoUpload.directive.js",
            "public/assets/directive/convertNumber.directive.js",
            "public/assets/directive/zoom.directive.js",

            <!-- filter -->
            "public/assets/filter/cardvalidate.js",
            "public/assets/filter/alphabetfilter.js",
            "public/assets/controller/user.controller.js",
            <!-- dot dot dot -->
            'public/scripts/lib/ng-file-upload-shim.min.js',
            'public/scripts/lib/ng-file-upload.min.js',
            "public/vendor/jQuery-Facebook-Photo-Selector/csphotoselector.js",
            "public/s_js/libs/angular-animate.min.js",
            "public/scripts/lib/ng-img-crop.js",
            "public/s_js/libs/angular-resource.min.js",
            "public/s_js/jsapi.js",
            "public/s_js/socialPopup.js"
        ]),
            ngAnnotate(),
            concat('search.js'),
            gulp.dest('public/dist'),
            rename('search.min.js'),
            uglify().on('error', gutil.log),
            gulp.dest('public/dist')
        ],
        cb
    );
});

gulp.task('minify_css', function () {
    return gulp.src(
        [
            'public/bowers/font-awesome/css/font-awesome.min.css',
            'public/s_css/bootstrap.min.css',
			'public/s_css/jquery.mCustomScrollbar.css',
            'public/s_css/style.css',
            'public/s_css/angular-toastr.css'
        ])
        .pipe(concat('front.css'))
        .pipe(gulp.dest('public/dist'))
        .pipe(rename('front.min.css'))
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        }))
        .pipe(gulp.dest('public/dist'));
});