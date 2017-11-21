// Gulp Plugins
const gulp = require('gulp');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const prefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const rigger = require('gulp-rigger');
const csso = require('gulp-csso');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
// For server
const browserSync = require('browser-sync');
const reload = browserSync.reload;


//Project paths
const path = {
	build: { // Where
		html: './build',
		css: './build/css',
		js: './build/js',
		img: './build/images'
	},
	src: { // From
		html: './html/*.html',
		css: './css/style.sass',
		js: './js/partials/*.js',
		img: './images/**/*.*'
	},
	watch: { // Watching for changes
		html: './html/**/*.html',
		css: './css/**/*.sass',
		js: './js/partials/*.js',
		img: './images/**/*.*'
	}
}


const serverConfig = {
	server: {
		baseDir: "./build"
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "gulp_project"
};


//Tasks
gulp.task('MakeHTMLGreatAgain', () => {
	gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({
			stream: true
		}));
});


gulp.task('MakeCssGreatAgain', () => {
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


gulp.task('MakeJsGreatAgain', () => {
	gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('MakeImgGreatAgain', () => {
	gulp.src(path.src.img)
	.pipe(imagemin({ 
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()],
		interlaced: true
	}))
	.pipe(gulp.dest(path.build.img))
	.pipe(reload({
		stream: true
	}));
});

gulp.task('MakeProjectGreatAgain', [
	'MakeHTMLGreatAgain',
	'MakeCssGreatAgain',
	'MakeJsGreatAgain',
	'MakeImgGreatAgain'
]);


gulp.task('watch', () => {
	watch([path.watch.html], function(event, cb) {
		gulp.start('MakeHTMLGreatAgain');
	});
	watch([path.watch.css], function(event, cb) {
		gulp.start('MakeCssGreatAgain');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('MakeJsGreatAgain');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('MakeImgGreatAgain');
	});
});


gulp.task('webserver', () => {
	browserSync(serverConfig);
});


gulp.task('default', ['MakeProjectGreatAgain', 'webserver', 'watch']);