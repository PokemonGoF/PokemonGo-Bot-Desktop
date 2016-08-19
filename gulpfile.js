'use strict';

const gulp = require('gulp'),
    async = require('async'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    zip = require('gulp-zip'),
    util = require('gulp-util'),
    packageElectron = require('gulp-atom-electron'),
    symdest = require('gulp-symdest'),
    git = require('gulp-git'),
    exec = require('child_process').exec,
    grimraf = require('gulp-rimraf'),
    debug = require('gulp-debug'),
    vfs = require('vinyl-fs'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    rseq = require('run-sequence'),
    merge = require('merge2'),
    electron = require('electron-connect'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    vueify = require('vueify'),
    editJson = require("gulp-json-editor"),
    isCommand = (command, callback) => require('command-exists')(command, (err, exists) => {
        if (err) callback(err);
        else if (!exists) callback(util.PluginError('Command', `Please install ${command}`))
    });


/*********************
 *       CONFIG       *
 *********************/
const BUILD_DIR = 'build',
    RELEASE_DIR = 'release',
    BOT_DIR = `${BUILD_DIR}/gofbot`,
    PACKAGES_DIR = `${BOT_DIR}/packages`,
    PACKAGE_SRC = [`${BUILD_DIR}/**/*`, `!${BUILD_DIR}/{packages,packages/**}`],
    INFO = require('./package.json'),
    SERVER = electron.server.create({path: BUILD_DIR, verbose: true});

/*********************
 *      GOFBOT       *
 *********************/
gulp.task('gofbot:install', callback => {
    isCommand('pip', callback);
    async.waterfall([
        cb => rimraf(PACKAGES_DIR, cb),
        cb => async.concat(fs.readFileSync(`${BOT_DIR}/requirements.txt`)
            .toString()
            .split('\n')
            .map(dep => dep.trim().replace('-e ', '')), (cmd, _) => exec(`pip install ${cmd} --target ${PACKAGES_DIR}`, _), err => cb(err)),
        cb => fs.open(`${PACKAGES_DIR}/google/__init__.py`, 'wx', cb),
        (file, cb) => fs.close(file, cb)
    ], callback);
});

gulp.task('gofbot:associate', callback => {
    async.waterfall([
        _ => fs.readFile(`${BOT_DIR}/pokecli.py`, _),
        (data, cb) => {
            let parsed = data.toString().split('\n');
            var targetIndex = 0;
            for (let i = 0; i <= parsed.length; i++) {
                let line = parsed[i];
                if (line.toLowerCase().indexOf('import sys') == 0) {
                    targetIndex = i;
                    break;
                }
            }
            parsed.splice(targetIndex + 1, 0, 'sys.path.insert(0, \'packages\')');
            cb(null, new Buffer(parsed.join('\n')));
        },
        (data, _) => fs.writeFile(`${BOT_DIR}/pokecli.py`, data, _)
    ], callback);
});

gulp.task('gofbot:update', (callback) => {
    isCommand('git', callback);
    async.series([
        _ => git.exec({args: `submodule deinit -f ${BOT_DIR}`}, _),
        _ => git.updateSubmodule({args: '--init --recursive'}, _)
    ], callback);
});

gulp.task('gofbot:prune', (callback) => {
    //TODO - Switch to grimraf
    async.parallel([
        _ => rimraf(`${BOT_DIR}/docs`, _),
        _ => rimraf(`${BOT_DIR}/.github`, _),
        _ => rimraf(`${BOT_DIR}/tests`, _),
        _ => rimraf(`${BOT_DIR}/web`, _),
        _ => rimraf(`${BOT_DIR}/windows_bat`, _),
        _ => async.concat(['ws_server.py', 'run.sh', 'setup.sh', 'README.md', 'pylint-recursive.py', 'Procfile', 'LICENSE', 'json-validate.py',
            'Dockerfile', 'CONTRIBUTORS.md', 'docker-compose.yml', 'docker-compose_tor.yml', '.travis.yml', '.styles.yapf',
            '.pylintrc', '.mention-bot', '.pullapprove.yml', '.dockerignore', '.gitignore'].map(x => `${BOT_DIR}/${x}`), fs.unlink, _)
    ], callback);
});

gulp.task('gofbot', _ => rseq('gofbot:update', ['gofbot:prune', 'gofbot:install', 'gofbot:associate'], _));

/*********************
 *       BUILD       *
 *********************/
gulp.task('build:clean', () => vfs.src([`${BUILD_DIR}/*`, `!${BUILD_DIR}/{gofbot,gofbot/*,pywin,pywin/*}`]).pipe(grimraf()));

gulp.task('build:node', () => {
    const getNodeModules = () => Object.keys(JSON.parse(fs.readFileSync('package.json').toString()).dependencies).map(_ => `node_modules/${_}/**/*`);
    return merge(
        vfs.src(getNodeModules(), {base: '.'})
            .pipe(gulp.dest(BUILD_DIR)),
        gulp.src('package.json')
            .pipe(editJson(json => {
                delete json['devDependencies'];
                return json;
            }))
            .pipe(gulp.dest(BUILD_DIR))
    );
});

gulp.task('build:js', callback => {
    const browserConfig = {
        entries: ['app/electron.js', 'app/src/main.js'],
        extensions: ['.js', '.vue'],
        ignoreMissing: true,
        detectGlobals: false,
        bare: true
    };
    return browserify(browserConfig)
        .transform(vueify, {autoprefixer: { browsers: ['last 2 Chrome versions']}})
        .transform(babelify, {presets: ["es2015"]})
        .bundle()
        .pipe(fs.createWriteStream(`${BUILD_DIR}/bundle.js`))
});

gulp.task('build:assets', () => gulp.src('app/src/assets/**/*', {base: 'app/src'}).pipe(gulp.dest(BUILD_DIR)));

gulp.task('build', _ => rseq('build:clean', ['gofbot', 'build:node', 'build:assets'], _));

/*********************
 *      ELECTRON     *
 *********************/
gulp.task('electron:osx', () => {
    return gulp.src(PACKAGE_SRC, {base: 'build'})
        .pipe(packageElectron({
            version: INFO.version,
            platform: 'darwin',
            darwinIcon: 'src/assets/resources/image/icons/pokemon.icns',
            darwinBundleIdentifier: 'com.github.pokemongof'
        })).pipe(symdest(RELEASE_DIR));
});

gulp.task('electron:windows', () => {
    return gulp.src(PACKAGE_SRC.concat(`${BUILD_DIR}pywin/**/*`), {base: 'build'})
        .pipe(packageElectron({
            version: INFO.version,
            platform: 'win32',
            arch: 'ia32',
            winIcon: 'src/assets/resources/image/icons/pokemon.ico',
            companyName: INFO.author,
            copyright: '2016 PokemonGOF, All Rights Reserved.'
        }))
        .pipe(zip('app-windows.exe'))
        .pipe(gulp.dest(RELEASE_DIR));
});

gulp.task('electron', ['electron:windows', 'electron:osx']);

/*********************
 *        CORE       *
 *********************/
gulp.task('run', () => SERVER.start());
gulp.task('develop', _ => rseq('build', 'run', _));
gulp.task('release', _ => rseq('build', 'electron', _));