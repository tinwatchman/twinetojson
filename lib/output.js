"use strict";

const fs = require("fs");
const _ = require("underscore");

module.exports = function saveJSON(path, story, options) {
    var isPrettyPrint = _.has(options, "prettyPrint") ? options.prettyPrint : false;
    return new Promise((resolve, reject) => {
        var json;
        if (isPrettyPrint) {
            json = JSON.stringify(story, null, 4);
        } else {
            json = JSON.stringify(story);
        }
        fs.writeFile(path, json, {"encoding":"utf8"}, (err) => {
            if (err && err !== null) {
                return reject(err);
            }
            resolve(story);
        });
    });
};