// Plugins
var gulp = require('gulp');
var sass = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');

var browserSync = require('browser-sync');
var	reload = browserSync.reload;

//Paths
var path = {
	build: { // Where
		css: './css/'
	},
	src: { // From
		css: './css/style.sass'
	},
	watch: {// Watching for changes
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
gulp.task('MakeCssGreatAgain', function() {
	gulp.src(path.src.css)
		.pipe(sass())
		.pipe(prefixer())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('watch', function() {
	watch([path.watch.css], function(event, cb) {
		gulp.start('MakeCssGreatAgain');
	})
});

gulp.task('webserver', function() {
	browserSync(serverConfig);
});

gulp.task('default', ['MakeCssGreatAgain', 'webserver', 'watch']);