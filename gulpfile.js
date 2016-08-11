const gulp = require('gulp');
const async = require('async');
const fs = require('fs');
const rimraf = require('rimraf');
const zip = require('gulp-zip');
const util = require('gulp-util');
const electron = require('gulp-atom-electron');
const symdest = require('gulp-symdest');
const git = require('gulp-git');
const exec = require('child_process').exec;
const grimraf = require('gulp-rimraf');
const debug = require('gulp-debug');
const vfs = require('vinyl-fs');
const imagemin = require ('gulp-imagemin');
const sass = require('gulp-sass');
const merge = require('merge2');
const runElectron = require("gulp-run-electron");

//CONFIG
const BUILD_DIR = 'build';
const RELEASE_DIR = 'release';
const PACKAGES_DIR = `${BUILD_DIR}/packages`;
const BOT_DIR = `${BUILD_DIR}/gofbot`;

gulp.task('python:install', callback => {
    async.waterfall([
        cb => rimraf(PACKAGES_DIR, cb),
        cb => async.concat(fs.readFileSync('build/gofbot/requirements.txt')
            .toString()
            .split('\n')
            .map(dep => dep.trim().replace('-e ', '')), (cmd, _) => exec(`pip install ${cmd} --target ${PACKAGES_DIR}`, _), err => cb(err)),
        cb => fs.open(`${PACKAGES_DIR}/google/__init__.py`, 'wx', cb),
        (file, cb) => fs.close(file, cb)
    ], callback);
});

gulp.task('python:package', ['python:install'], () => {
    return gulp.src(`${PACKAGES_DIR}/**/!(*.pyc|*.egg-info)`)
        .pipe(zip('packages.zip'))
        .pipe(grimraf())
        .pipe(gulp.dest('build'))
});

const PACKAGE_SRC = [`${BUILD_DIR}/**/*`, `!${BUILD_DIR}/{packages,packages/**}`];

gulp.task('electron:osx', ['python:package'], () => {
    return gulp.src(PACKAGE_SRC, {base: '.'})
        .pipe(electron({
            version: '1.3.3',
            platform: 'darwin',
            darwinIcon: 'src/assets/resources/image/icons/pokemon.icns',
            darwinBundleIdentifier: 'com.github.pokemongof'
        })).pipe(symdest(RELEASE_DIR));
});

gulp.task('electron:windows', ['python:package'], () => {
    return gulp.src(PACKAGE_SRC.concat('pywin/**/*'), {base: '.'})
        .pipe(electron({
            version: '1.3.3',
            platform: 'win32',
            arch: 'ia32',
            winIcon: 'src/assets/resources/image/icons/pokemon.ico',
            companyName: 'PokemonGoF',
            copyright: '2016 PokemonGOF, All Rights Reserved.'
        }))
        .pipe(zip('app-windows.exe'))
        .pipe(gulp.dest(RELEASE_DIR));
});


gulp.task('gofbot:update', (callback) => {
    async.series([
        _ => git.exec({args: `submodule deinit -f ${BOT_DIR}`}, _),
        _ => git.updateSubmodule({ args: '--init' }, _)
    ], callback);
});

gulp.task('gofbot:prune', ['gofbot:update'], (callback) => {
    //TODO - Switch to grimraf
    async.parallel([
        _ => rimraf(`${BOT_DIR}/docs`, _),
        _ => rimraf(`${BOT_DIR}/.github`, _),
        _ => rimraf(`${BOT_DIR}/tests`, _),
        _ => async.concat(['ws_server.py', 'run.sh', 'setup.sh', 'README.md', 'pylint-recursive.py', 'run.bat',
            'LICENSE', 'Dockerfile', 'install.sh', 'CONTRIBUTORS.md', 'docker-compose.yml', '.travis.yml', '.styles.yapf',
            '.pylintrc', '.mention-bot', '.pullapprove.yml', '.dockerignore', '.gitignore'].map(x => `${BOT_DIR}/${x}`), fs.unlink, _)
    ], callback);
});

gulp.task('clean', () => vfs.src([`${BUILD_DIR}/*`, `!${BUILD_DIR}/{gofbot,gofbot/*,pywin,pywin/*}`]).pipe(grimraf()));

gulp.task('build:node', ['clean'], () => {
    const getNodeModules = () => Object.keys(JSON.parse(fs.readFileSync('package.json').toString()).dependencies).map(_ => `node_modules/${_}/**/*`);
    return merge(
        vfs.src(getNodeModules(),  {base: '.'})
            .pipe(gulp.dest(BUILD_DIR)),
        gulp.src('package.json')
            .pipe(gulp.dest(BUILD_DIR))
    );
});

gulp.task('build:src', ['clean'], () => {
    return merge(
        gulp.src(['src/**/*', '!src/{styles,styles/**}'])
            .pipe(gulp.dest(BUILD_DIR)),
        gulp.src('src/**/*.{scss,sass}')
            .pipe(sass({ includePaths: ['node_modules/materialize-css/sass'] }).on('error', sass.logError))
            .pipe(gulp.dest(BUILD_DIR))
    );
});

gulp.task('electron:run', ['build'], () => {
    gulp.src("build").pipe(runElectron());
});

gulp.task('build', ['gofbot:prune', 'build:node', 'build:src']);
gulp.task('develop', ['build', 'electron:run']);
gulp.task('release', ['build', 'python:package', 'electron:osx', 'electron:windows']);