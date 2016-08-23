"use strict";

const gulp = require('gulp'),
    async = require('async'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    rseq = require('run-sequence'),
    util = require('gulp-util'),
    git = require('gulp-git'),
    exec = require('child_process').exec,
    config = require('./config');

const isCommand = (command, callback) => require('command-exists')(command, (err, exists) => {
    if (err) callback(err);
    else if (!exists) callback(util.PluginError('Command', `Please install ${command}`))
});

gulp.task('gofbot:install', callback => {
    isCommand('pip', callback);
    async.waterfall([
        cb => rimraf(config.paths.packages, cb),
        cb => async.concat(fs.readFileSync(`${config.paths.bot}/requirements.txt`)
            .toString()
            .split('\n')
            .map(dep => dep.trim().replace('-e ', '')), (cmd, _) => exec(`pip install ${cmd} --target ${config.paths.packages}`, _), err => cb(err)),
        cb => fs.open(`${config.paths.packages}/google/__init__.py`, 'wx', cb),
        (file, cb) => fs.close(file, cb)
    ], callback);
});

gulp.task('gofbot:associate', callback => {
    async.waterfall([
        _ => fs.readFile(`${config.paths.bot}/pokecli.py`, _),
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
        (data, _) => fs.writeFile(`${config.paths.bot}/pokecli.py`, data, _)
    ], callback);
});

gulp.task('gofbot:update', (callback) => {
    isCommand('git', callback);
    async.series([
        _ => git.exec({args: `submodule deinit -f ${config.paths.bot}`}, _),
        _ => git.updateSubmodule({args: '--init --recursive'}, _)
    ], callback);
});

gulp.task('gofbot:prune', (callback) => {
    //TODO - Switch to grimraf
    const tasks = [_ => async.concat(config.gofbot_ignore.files.map(x => `${config.paths.bot}/${x}`), fs.unlink, _)];
    config.gofbot_ignore.folders.forEach(folder => tasks.push(_ => rimraf(`${config.paths.bot}/${folder}`, _)));
    async.parallel(tasks, callback);
});

gulp.task('gofbot', _ => rseq('gofbot:update', ['gofbot:prune', 'gofbot:install', 'gofbot:associate'], _));
