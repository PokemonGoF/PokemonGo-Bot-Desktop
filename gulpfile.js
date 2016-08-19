'use strict';
const electron = require('electron-connect');
const gulp = require('gulp');
const rseq = require('run-sequence');
const config = require('./tasks/config');

require('require-dir')('tasks', {recursive: true});

gulp.task('run', () => electron.server.create({path: config.paths.build, verbose: true}).start());
gulp.task('develop', _ => rseq('build', 'run', _));
gulp.task('release', _ => rseq('build', 'electron', _));
