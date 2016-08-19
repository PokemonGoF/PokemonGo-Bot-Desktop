const browserify = require("browserify");
const babelify = require("babelify");
const vueify = require("vueify");
const fs = require("fs");
const debug = require("gulp-debug");

console.log("Starting");
process.env.NODE_ENV = 'development';
const browserConfig = {
    entries: 'app/src/main.js',
    extension: ['', '.js', '.vue'],
    ignoreMissing: true,
    detectGlobals: false,
    bare: true
};
browserify(browserConfig)
    .transform(vueify, {babel: {presets: ["es2015"], plugins: ["transform-runtime"]}})
    .bundle()
    .pipe(fs.createWriteStream('build/bundle.js'));

console.log("Done");

//
