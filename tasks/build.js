const gulp = require('gulp'),
    rimraf = require('rimraf'),
    grimraf = require('gulp-rimraf'),
    vfs = require('vinyl-fs'),
    rseq = require('run-sequence'),
    merge = require('merge2'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    vueify = require('vueify'),
    editJson = require("gulp-json-editor");

gulp.task('build:clean', () => vfs.src([`${config.paths.build}/*`, `!${config.paths.build}/{gofbot,gofbot/*,pywin,pywin/*}`]).pipe(grimraf()));

gulp.task('build:node', () => {
    const getNodeModules = () => Object.keys(JSON.parse(fs.readFileSync('package.json').toString()).dependencies).map(_ => `node_modules/${_}/**/*`);
    return merge(
        vfs.src(getNodeModules(), {base: '.'})
            .pipe(gulp.dest(config.paths.build)),
        gulp.src('package.json')
            .pipe(editJson(json => {
                delete json['devDependencies'];
                return json;
            }))
            .pipe(gulp.dest(config.paths.build))
    );
});

gulp.task('build:js', () => {
    const browserConfig = {
        entries: [`${config.paths.app}/electron.js`, `${config.paths.app}/main.js`],
        extension: ['.js', '.vue'],
        ignoreMissing: true,
        detectGlobals: false,
        bare: true
    };
    return browserify(browserConfig)
        .transform(vueify, {babel: {presets: ["es2015"], plugins: ["transform-runtime"]}})
        .transform(babelify, {presets: ["es2015"]})
        .bundle()
        .pipe(fs.createWriteStream('build/bundle.js'));
});


gulp.task('build:assets', () => merge(
    gulp.src(`${config.paths.src}/assets/**/*`, {base: config.paths.src})
        .pipe(gulp.dest(config.paths.release))
));

gulp.task('build', _ => rseq('build:clean', ['gofbot', 'build:node', 'build:assets', 'build:js'], _));