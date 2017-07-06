// Gulp Plugins
var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');
var rigger = require('gulp-rigger');
// For server
var browserSync = require('browser-sync');
var	reload = browserSync.reload;


//Project paths
var path = {
	build: { // Where
		html: './',
		css: './css/'
	},
	src: { // From
		html: './html/*.html',
		css: './css/style.sass'
	},
	watch: {// Watching for changes
		html: './html/**/*.html',
		css: './css/**/*.sass'
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
		.pipe(prefixer())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({
			stream: true
		}));
});


gulp.task('MakeProjectGreatAgain', [
	'MakeHTMLGreatAgain',
	'MakeCssGreatAgain'
]);


gulp.task('watch', function() {
	watch([path.watch.html], function(event, cb) {
		gulp.start('MakeHTMLGreatAgain');
	});
	watch([path.watch.css], function(event, cb) {
		gulp.start('MakeCssGreatAgain');
	});
});


gulp.task('webserver', function() {
	browserSync(serverConfig);
});


gulp.task('default', ['MakeProjectGreatAgain', 'webserver', 'watch']);