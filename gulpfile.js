// Plugins
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const sourcemap = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssCustomProperties = require('postcss-custom-properties');
const postCssCustomMedia = require('postcss-custom-media');
const autoPrefixer = require('autoprefixer');
const cssNano = require('cssnano');
const imageMin = require('gulp-imagemin');
const pngQuant = require('imagemin-pngquant');
const webpackStream = require('webpack-stream');

// Server
const browserSync = require('browser-sync');
const reload = browserSync.reload;

// Env variable
const env = process.env.NODE_ENV;

// Project paths
const path = {
	build: { // Where
		html: './build',
		css: './build/css',
		js: './build/js',
		img: './build/images',
		fonts: './build/fonts'
	},
	src: { // From
		html: './src/html/pages/**/*.pug',
		css: './src/css/style.css',
		js: './src/js/index.js',
		img: './src/images/**/*.*',
		fonts: './src/fonts/**/*.*'
	},
	watch: { // Watching for changes
		html: './src/html/**/*.pug',
		css: './src/css/**/*.css',
		js: './src/js/**/*.js',
		img: './src/images/**/*.*',
		fonts: './src/fonts/**/*.*'
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

// Tasks
gulp.task('makeHtmlGreatAgain', () => {
	return gulp.src(path.src.html)
		.pipe(pug({
			verbose: true
		}))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('makeCssGreatAgain', () => {
	const plugins = [
		postcssImport,
		postcssNested,
		postcssCustomProperties,
		postCssCustomMedia,
		autoPrefixer(),
		cssNano
	];

	return gulp.src(path.src.css)
		.pipe(gulpIf(env === 'development', sourcemap.init()))
		.pipe(postcss(plugins))
		.pipe(gulpIf(env === 'development', sourcemap.write()))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('makeJsGreatAgain', () => {
	return gulp.src(path.src.js)
		.pipe(webpackStream({
			mode: env,
			output: {
				filename: 'bundle.js'
			},
			module: {
				rules: [
					{
						test: /\.(js)$/,
						exclude: /(node_modules)/,
						loader: 'babel-loader',
						query: {
							presets: ['env']
						}
					}
				]
			}
		}))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('makeImgGreatAgain', () => {
	return gulp.src(path.src.img)
		.pipe(imageMin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngQuant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('makeFontsGreatAgain', () => {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
});

gulp.task('watch', () => {
	gulp.watch(path.watch.html, gulp.series('makeHtmlGreatAgain'));
	gulp.watch(path.watch.css, gulp.series('makeCssGreatAgain'));
	gulp.watch(path.watch.js, gulp.series('makeJsGreatAgain'));
	gulp.watch(path.watch.img, gulp.series('makeImgGreatAgain'));
	gulp.watch(path.watch.fonts, gulp.series('makeFontsGreatAgain'));
});

gulp.task('webServer', () => {
	browserSync(serverConfig);
});

gulp.task('dev', gulp.series(
	gulp.series(
		'makeHtmlGreatAgain',
		'makeCssGreatAgain',
		'makeJsGreatAgain',
		'makeImgGreatAgain',
		'makeFontsGreatAgain'
	),
	gulp.parallel(
		'webServer',
		'watch'
	)
));

gulp.task('prod', gulp.series(
	'makeHtmlGreatAgain',
	'makeCssGreatAgain',
	'makeJsGreatAgain',
	'makeImgGreatAgain',
	'makeFontsGreatAgain'
));