const gulp = require('gulp'),
    zip = require('gulp-zip'),
    symdest = require('gulp-symdest'),
    packageElectron = require('gulp-atom-electron'),
    config = require('./config');

gulp.task('electron:osx', () => {
    return gulp.src(PACKAGE_SRC, {base: 'build'})
        .pipe(packageElectron({
            version: config.version,
            platform: 'darwin',
            darwinIcon: 'src/assets/resources/image/icons/pokemon.icns',
            darwinBundleIdentifier: 'com.github.pokemongof'
        })).pipe(symdest(RELEASE_DIR));
});

gulp.task('electron:windows', () => {
    return gulp.src(PACKAGE_SRC.concat(), {base: 'build'})
        .pipe(packageElectron({
            version: config.version,
            platform: 'win32',
            arch: 'ia32',
            winIcon: 'src/assets/resources/image/icons/pokemon.ico',
            companyName: config.company,
            copyright: '2016 , All Rights Reserved.'
        }))
        .pipe(zip('app-windows.exe'))
        .pipe(gulp.dest(RELEASE_DIR));
});

gulp.task('electron', ['electron:windows', 'electron:osx']);