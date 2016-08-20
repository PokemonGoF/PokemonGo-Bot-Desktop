'use strict';
const gulp = require('gulp'),
    electron = require('electron-connect'),
    config = require('./tasks/config.js');

require('require-dir')('tasks', {recursive: true});

gulp.task('run', () => electron.server.create({path: config.paths.build, verbose: true}).start());
gulp.task('develop', _ => rseq('build', 'run', _));
gulp.task('release', _ => rseq('build', 'electron', _));