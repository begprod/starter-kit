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
// Server
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
		html: './src/html/*.html',
		css: './src/css/style.sass',
		js: './src/js/partials/*.js',
		img: './src/images/**/*.*'
	},
	watch: { // Watching for changes
		html: './src/html/**/*.html',
		css: './src/css/**/*.sass',
		js: './src/js/**/*.js',
		img: './src/images/**/*.*'
	}
};


const serverConfig = {
	server: {
		baseDir: "./build"
	},
	tunnel: false,
	host: 'localhost',
	port: 9000,
	logPrefix: "gulp_project"
};


//Tasks
gulp.task('makeHtmlGreatAgain', () => {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({
			stream: true
		}));
});


gulp.task('makeCssGreatAgain', () => {
	return gulp.src(path.src.css)
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


gulp.task('makeJsGreatAgain', () => {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('makeImgGreatAgain', () => {
	return gulp.src(path.src.img)
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

gulp.task('watch', () => {
	gulp.watch(path.watch.html, gulp.series('makeHtmlGreatAgain'));
	gulp.watch(path.watch.css, gulp.series('makeCssGreatAgain'));
	gulp.watch(path.watch.js, gulp.series('makeJsGreatAgain'));
	gulp.watch(path.watch.img, gulp.series('makeImgGreatAgain'));
});

gulp.task('webserver', () => {
	browserSync(serverConfig);
});

gulp.task('default', gulp.series(
	gulp.parallel(
		'makeHtmlGreatAgain',
		'makeCssGreatAgain',
		'makeJsGreatAgain',
		'makeImgGreatAgain',
		'webserver',
		'watch'
	),
));