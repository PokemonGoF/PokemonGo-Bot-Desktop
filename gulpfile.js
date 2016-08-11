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
const merge = require('merge-stream');
const debug = require('gulp-debug');



//CONFIG
const BUILD_DIR = 'build';
const PACKAGES = `${BUILD_DIR}/packages`;
const BOT = `${BUILD_DIR}/gofbot`;

gulp.task('python:install', callback => {
    async.waterfall([
        cb => rimraf(PACKAGES, cb),
        cb => async.concat(fs.readFileSync('build/gofbot/requirements.txt')
            .toString()
            .split('\n')
            .map(dep => dep.trim().replace('-e ', '')), (cmd, _) => exec(`pip install ${cmd} --target ${PACKAGES}`, _), err => cb(err)),
        cb => fs.open(`${PACKAGES}/google/__init__.py`, 'wx', cb),
        (file, cb) => fs.close(file, cb)
    ], callback);
});

gulp.task('python:package', ['python:install'], () => {
    return gulp.src(`${PACKAGES}/**/!(*.pyc|*.egg-info)`)
        .pipe(zip('packages.zip'))
        .pipe(gulp.dest('build'))
});

const PACKAGE_SRC = ['app/**', 'LICENSE', 'gofbot/**/*', 'package.json', 'main.js'];

gulp.task('electron:osx', ['python:package'], () => {
    return gulp.src(PACKAGE_SRC, {base: '.'})
        .pipe(electron({
            version: '1.3.3',
            platform: 'darwin',
            darwinIcon: 'src/assets/resources/image/icons/pokemon.icns',
            darwinBundleIdentifier: 'com.github.pokemongof'
        })).pipe(symdest('build'));
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
        .pipe(gulp.dest('build/'));
});


gulp.task('gofbot:update', (callback) => {
    async.series([
        _ => git.exec({args: `submodule deinit -f ${BOT}`}, _),
        _ => git.updateSubmodule({ args: '--init' }, _)
    ], callback);
});

gulp.task('gofbot:prune', ['gofbot:update'], (callback) => {
    async.parallel([
        _ => rimraf(`${BOT}/docs`, _),
        _ => rimraf(`${BOT}/web`, _),
        _ => rimraf(`${BOT}/.github`, _),
        _ => rimraf(`${BOT}/tests`, _),
        _ => async.concat(['ws_server.py', 'run.sh', 'setup.sh', 'README.md', 'pylint-recursive.py', 'run.bat',
            'LICENSE', 'Dockerfile', 'install.sh', 'CONTRIBUTORS.md', 'docker-compose.yml', '.travis.yml', '.styles.yapf',
            '.pylintrc', '.mention-bot', '.pullapprove.yml', '.gitmodules', '.dockerignore', '.gitignore'].map(x => `${BOT}/${x}`), fs.unlink, _)
    ], callback);
});

gulp.task('copy', () => {
    return merge(
        gulp.src('node_modules/**/.*',  {base: '.'}).pipe(debug()).pipe(gulp.dest('build')),
        gulp.src('src/.*').pipe(debug()).pipe(gulp.dest('build')),
        gulp.src('package.json',  {base: '.'}).pipe(gulp.dest('build'))
    );
});

gulp.task('build', ['gofbot:prune']);
gulp.task('release', ['build', 'python:package', 'electron:osx', 'electron:windows']);