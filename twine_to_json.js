"use strict";

const path = require("path");
const _ = require("underscore");
var readFile = require("./lib/readfile");
var parsePassages = require("./lib/parser").parsePassages;
var saveJSON = require("./lib/output");

module.exports = function twineToJSON(options) {
    // parse options
    var isWritingToFile = _.has(options, "writeToFile") ? options.writeToFile : true;
    var callback = _.has(options, "callback") && _.isFunction(options.callback) ? options.callback : null;
    // get files
    var inPath = _.has(options, "in") ? options.in : null,
        outPath = _.has(options, "out") ? options.out : null;
    if (inPath === null || !_.isString(inPath) || _.isEmpty(inPath)) {
        throw new Error("Input file argument required!");
    } else if (!path.isAbsolute(inPath)) {
        // resolve inPath to absolute path from cwd
        inPath = path.resolve(process.cwd(), inPath);
    }
    if (outPath === null && isWritingToFile) {
        // default to story filename + ".json" in cwd
        var fileName = path.parse(inPath).name + ".json";
        outPath = path.resolve(process.cwd(), fileName);
    }
    // create promise
    var promise = new Promise((resolve, reject) => {
        readFile(inPath, options).then((story) => {
            story = parsePassages(story, options);
            if (!isWritingToFile) {
                resolve(story);
            } else {
                return saveJSON(outPath, story, options);
            }
        }).then((story) => {
            resolve(story);
        }).catch((err) => {
            reject(err);
        });
    });
    // support callback
    if (callback !== null) {
        promise.then((story) => {
            callback(null, story);
        }).catch((err) => {
            callback(err);
        });
    }
    // return promise regardless
    return promise;
};
