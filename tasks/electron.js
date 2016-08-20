const gulp = require('gulp'),
    zip = require('gulp-zip'),
    symdest = require('gulp-symdest'),
    packageElectron = require('gulp-atom-electron'),
    config = require('./config');

gulp.task('electron:osx', () => {
    return gulp.src(config.electron.osx_packages, {base: config.paths.build})
        .pipe(packageElectron({
            version: config.version,
            platform: 'darwin',
            darwinIcon: `${config.paths.build}/pokemon.icns`,
            darwinBundleIdentifier: 'com.github.pokemongof'
        })).pipe(symdest(config.paths.relrease));
});

gulp.task('electron:windows', () => {
    return gulp.src(config.electron.win_packages, {base: config.paths.build})
        .pipe(packageElectron({
            version: config.version,
            platform: 'win32',
            arch: 'ia32',
            winIcon: `${config.paths.build}/pokemon.ico`,
            companyName: config.company,
            copyright: '2016 , All Rights Reserved.'
        }))
        .pipe(zip('app-windows.exe'))
        .pipe(gulp.dest(config.paths.relrease));
});

gulp.task('electron', ['electron:windows', 'electron:osx']);