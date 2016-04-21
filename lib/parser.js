"use strict";

const crypto = require("crypto");
const _ = require("underscore");
const marked = require("marked");
const Link = require("./data").Link;

function parsePassages(story, options) {
    var ignoreComments = _.has(options, "ignoreComments") ? options.ignoreComments : false,
        isRenderingMarkdown = _.has(options, "renderMarkdown") ? options.renderMarkdown : true;
    _.each(story.passages, function(passage) {
        if (!ignoreComments) {
            passage.text = removeComments(passage);
        }
        passage.text = parseLinks(passage, story);
        if (isRenderingMarkdown) {
            passage.text = renderMarkdown(passage);
        }
    });
    return story;
};

function removeComments(passage) {
    return passage.text.replace(/\/\*.*\*\//g, '');
};

function parseLinks(passage, story) {
    return passage.text.replace(/\[\[(.*?)\]\]/g, function(match, innerText) {
        var label,
            targetName,
            rightArrowIndex = innerText.indexOf("->"),
            leftArrowIndex = (rightArrowIndex === -1) ? innerText.indexOf("<-") : -1,
            barIndex = (rightArrowIndex === -1 && leftArrowIndex === -1) ? innerText.indexOf("|") : -1;
        
        if (rightArrowIndex > -1) {
            // label->target format
            label = innerText.substr(0, rightArrowIndex);
            targetName = innerText.substr(rightArrowIndex + 2);
        } else if (leftArrowIndex > -1) {
            // target<-label format
            targetName = innerText.substr(0, leftArrowIndex);
            label = innerText.substr(leftArrowIndex + 2);
        } else if (barIndex > -1) {
            // label|target format
            label = innerText.substr(0, barIndex);
            targetName = innerText.substr(barIndex + 1);
        } else {
            // assume target and label are the same
            label = innerText;
            targetName = innerText;
        }

        // find passage
        var target = _.findWhere(story.passages, {"name": targetName});
        if (_.isUndefined(target)) {
            throw new Error("Error: Unable to find passage with name '" + targetName + "'!");
        }

        // create link object
        var link = new Link();
        link.id = getLinkId(passage.pid + "|" + label + "|" + target.pid);
        link.label = label;
        link.passageId = target.pid;
        passage.links.push(link);

        // replace with link template string
        return "<%= links['" + link.id + "'] %>";
    });
};

function renderMarkdown(passage) {
    return _.unescape(marked(_.escape(passage.text)));
};

function getLinkId(str) {
    var hash = crypto.createHash('sha1').update(str);
    return hash.digest('hex');
};

module.exports = {
    'parsePassages': parsePassages,
    'removeComments': removeComments,
    'parseLinks': parseLinks,
    'renderMarkdown': renderMarkdown,
    'getLinkId': getLinkId
};