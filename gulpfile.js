// Gulp Plugins
var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rigger = require('gulp-rigger');
var csso = require('gulp-csso');
var plumber = require('gulp-plumber');
// For server
var browserSync = require('browser-sync');
var	reload = browserSync.reload;


//Project paths
var path = {
	build: { // Where
		html: './build',
		css: './build/css',
		js: './build/js'
	},
	src: { // From
		html: './html/*.html',
		css: './css/style.sass',
		js: './js/partials/*.js'
	},
	watch: {// Watching for changes
		html: './html/**/*.html',
		css: './css/**/*.sass',
		js: './js/partials/*.js'
	}
}


var serverConfig = {
	server: {
		baseDir: "./"
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "gulp_project"
};


//Tasks
gulp.task('MakeHTMLGreatAgain', function() {
	gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({
			stream: true
		}));
});


gulp.task('MakeCssGreatAgain', function() {
	gulp.src(path.src.css)
		.pipe(sass({
			outputStyle: 'compressed'
		})).on('error', sass.logError)
		.pipe(csso())
		.pipe(prefixer())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({
			stream: true
		}));
});


gulp.task('MakeJsGreatAgain', function() {
	gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('MakeProjectGreatAgain', [
	'MakeHTMLGreatAgain',
	'MakeCssGreatAgain',
	'MakeJsGreatAgain'
]);


gulp.task('watch', function() {
	watch([path.watch.html], function(event, cb) {
		gulp.start('MakeHTMLGreatAgain');
	});
	watch([path.watch.css], function(event, cb) {
		gulp.start('MakeCssGreatAgain');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('MakeJsGreatAgain');
	});
});


gulp.task('webserver', function() {
	browserSync(serverConfig);
});


gulp.task('default', ['MakeProjectGreatAgain', 'webserver', 'watch']);