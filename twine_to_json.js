"use strict";

const path = require("path");
const _ = require("underscore");
var readFile = require("./lib/readfile");
var parsePassages = require("./lib/parser").parsePassages;
var saveJSON = require("./lib/output");

/**
 * twineToJSON main function
 * @param  {Object}  options Options object -- see below for details
 * @return {Promise}         Promise
 *
 * Options:
 * @param  {String}    in             Path to Twine story file (required)
 * @param  {String}    out            Path to output JSON file (optional)
 * @param  {Boolean}   ignoreComments Whether or not to remove block comments
 *                                    (defaults to false)
 * @param  {Boolean}   renderMarkdown Whether or not to render markdown
 *                                    (defaults to true)
 * @param  {Boolean}   writeToFile    Whether or not to write the JSON file 
 *                                    to disk (defaults to true)
 * @param  {Boolean}   prettyPrint    Whether or not to pretty-print JSON
 *                                    (defaults to false)
 * @param  {Array}     ignorePassages List of passage ids to ignore when 
 *                                    assembling JSON. See README for details.
 * @param  {Array}  transformPassages Array of functions to apply to the passage
 *                                    text before parsing. See README for 
 *                                    details.                         
 * @param  {Array}     customTags     Array of custom tag objects to apply to 
 *                                    the passage markup
 * @param  {Function}  linkFormat     Custom link format function or Underscore 
 *                                    template string. Receives a Link object 
 *                                    with three properties: id, label and 
 *                                    passageId.
 * @param  {Function}  callback       Callback function (optional)
 */
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
