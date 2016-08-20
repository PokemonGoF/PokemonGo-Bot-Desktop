'use strict';
const gulp = require('gulp'),
    electron = require('electron-connect');

require('require-dir')('tasks', {recursive: true});

gulp.task('run', () => electron.server.create({path: BUILD_DIR, verbose: true}).start());
gulp.task('develop', _ => rseq('build', 'run', _));
gulp.task('release', _ => rseq('build', 'electron', _));