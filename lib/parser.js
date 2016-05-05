"use strict";

const crypto = require("crypto");
const _ = require("underscore");
const cheerio = require("cheerio");
const marked = require("marked");
const Link = require("./data").Link;

function parsePassages(story, options) {
    var ignoreComments = _.has(options, "ignoreComments") ? options.ignoreComments : false,
        isRenderingMarkdown = _.has(options, "renderMarkdown") ? options.renderMarkdown : true,
        hasCustomTags = (_.has(options, "customTags") && _.isArray(options.customTags)),
        hasTransforms = _.has(options, "transformPassages");
    _.each(story.passages, function(passage) {
        if (hasTransforms) {
            handleTransforms(passage, story, options.transformPassages);
        }
        if (!ignoreComments) {
            passage.text = removeComments(passage);
        }
        passage.text = parseLinks(passage, story);
        if (hasCustomTags) {
            handleCustomTags(passage, options.customTags);
        }
        if (isRenderingMarkdown) {
            passage.text = renderMarkdown(passage);
        }
    });
    return story;
};

/**
 * Applies given transformation functions to passage text
 * @param  {Passage}        passage           Passage object
 * @param  {Story}          Story             Story object
 * @param  {Array|Function} transformPassages Function or Array of 
 *                                            Functions to apply to 
 *                                            the passage.
 * @return {void}
 */
function handleTransforms(passage, story, transformPassages) {
    if (_.isFunction(transformPassages)) {
        transformPassages.apply(null, [passage, story]);
    } else if (_.isArray(transformPassages)) {
        _.each(transformPassages, function(transform) {
            transform.apply(null, [passage, story]);
        });
    }
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

/**
 * Replaces or edits custom tags within the passage html
 * @param  {Passage} passage    Passage object
 * @param  {Array}   customTags Array of customTag objects
 * @return {void}
 */
function handleCustomTags(passage, customTags) {
    var $ = cheerio.load(passage.text, {
        normalizeWhitespace: false,
        xmlMode: true,
        decodeEntities: true
    });
    _.each(customTags, function(customTag) {
        if (!_.isObject(customTag) || !_.has(customTag, "name")) {
            return;
        }
        var tags = $(customTag.name);
        if (_.has(customTag, "swap")) {
            // pull out tag innerHTML and wrap it in specified tags
            tags.each(function() {
                var c = $(this).contents().remove();
                var m = $(customTag.swap).append(c);
                $(this).replaceWith(m);
            });
        }
    });
    passage.text = $.html();
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
    'handleTransforms': handleTransforms,
    'removeComments': removeComments,
    'parseLinks': parseLinks,
    'handleCustomTags': handleCustomTags,
    'renderMarkdown': renderMarkdown,
    'getLinkId': getLinkId
};