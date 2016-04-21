"use strict";

const fs = require("fs");
const cheerio = require("cheerio");
const _ = require("underscore");
const Story = require("./data").Story;
const Passage = require("./data").Passage;

module.exports = function readFile(path, options) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, {"encoding":"utf8"}, (err, data) => {
            if (err && err !== null) {
                return reject(err);
            }
            var $ = cheerio.load(data, {
                normalizeWhitespace: false,
                xmlMode: true,
                decodeEntities: true
            });
            var story = getStory($, options);
            story.passages = getPassages($, options);
            resolve(story);
        });
    });
};

function getStory($, options) {
    var data = $("tw-storydata");
    var story = new Story();
    story.ifid = data.attr("ifid");
    story.name = data.attr("name");
    story.startNode = parseInt(data.attr("startnode"));
    story.creator = data.attr("creator");
    story.creatorVersion = data.attr("creator-version");
    story.format = data.attr("format");
    return story;
};

function getPassages($, options) {
    var passages = [];
    var passage;
    $("tw-passagedata").each(function(i) {
        passage = new Passage();
        passage.pid = parseInt($(this).attr("pid"));
        if (passage.pid > -1 && !_.contains(options.ignorePassages, passage.pid)) {
            passage.name = $(this).attr("name");
            passage.text = _.unescape($(this).text());
            passages.push(passage);
        }
    });
    return passages;
};