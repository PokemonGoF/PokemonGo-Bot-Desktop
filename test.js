const browserify = require("browserify");
const babelify = require("babelify");
const vueify = require("vueify");
const fs = require("fs");
const debug = require("gulp-debug");

console.log("Starting");
process.env.NODE_ENV = 'development';
const browserConfig = {
    entries: 'app/src/main.js',
    extension: ['.js', '.vue'],
    debug: true
};
browserify(browserConfig)
    .ignore('electron')
    .transform(vueify, {babel: {presets: ["es2015"]}})
    .transform(babelify, {presets: ["es2015"]})
    .bundle()
    .pipe(fs.createWriteStream('build/bundle.js'));

console.log("Done");

//
