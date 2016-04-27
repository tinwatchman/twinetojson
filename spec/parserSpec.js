describe("parser functions", function() {
    const _ = require("underscore");
    const crypto = require("crypto");

    describe("parseLinks", function() {
        var parseLinks = require("../lib/parser").parseLinks;
        var testStory = require("./support/test_story");

        it("should exist", function() {
            expect(parseLinks).toBeDefined();
            expect(_.isFunction(parseLinks)).toBe(true);
        });

        it("should parse the links within a passage (regardless of format)", function() {
            var testPassage = _.findWhere(testStory.passages, {"name": "My First Room"});
            var text = parseLinks(testPassage, testStory);
            expect(testPassage.links.length).toEqual(3);
            expect(_.findWhere(testPassage.links, {"passageId": 2})).toBeDefined();
            expect(_.findWhere(testPassage.links, {"passageId": 3})).toBeDefined();
            expect(_.findWhere(testPassage.links, {"passageId": 4})).toBeDefined();
            // test template replacement
            var ctx = { "links": {} };
            _.each(testPassage.links, function(link, index){
                ctx.links[link.id] = "$link" + index + "$";
            });
            var textTemplate = _.template(text);
            var result = textTemplate(ctx);
            expect(result.indexOf("$link0$")).toBeGreaterThan(-1);
            expect(result.indexOf("$link1$")).toBeGreaterThan(-1);
            expect(result.indexOf("$link2$")).toBeGreaterThan(-1);
        });
    });
    
    describe("removeComments", function() {
        var removeComments = require("../lib/parser").removeComments;

        it("should remove all /* */ style comments", function() {
            var testPassage = { text: "/* this is my comment! blah blah blah */nada" };
            expect(removeComments(testPassage)).toEqual("nada");
        });
    });

    describe("getLinkId", function() {
        var getLinkId = require("../lib/parser").getLinkId;

        it("should return the sha1 hash of the given string", function() {
            var testStr = "my test string";
            var hash = crypto.createHash('sha1');
            hash.update(testStr);
            var hashResult = hash.digest('hex');
            expect(getLinkId(testStr)).toEqual(hashResult);
        });
    });

    describe("handleCustomTags", function() {
        var handleCustomTags = require("../lib/parser").handleCustomTags;

        it("should exist", function() {
            expect(handleCustomTags).toBeDefined();
            expect(_.isFunction(handleCustomTags)).toBe(true);
        });

        it("should be able to swap out all given custom tags in the passage text", function() {
            var passage = {
                text: "<options>This is my list.<ul><li>yay</li></ul><custom>Hello</custom></options>"
            };
            var customTags = [
                { name: "options", swap: "<div></div>" },
                { name: "custom", swap: "<span></span>" }
            ];
            handleCustomTags(passage, customTags);
            expect(passage.text).toEqual("<div>This is my list.<ul><li>yay</li></ul><span>Hello</span></div>");
        });
    });

    describe("handleTransforms", function() {
        var handleTransforms = require("../lib/parser").handleTransforms;

        it("should exist", function() {
            expect(handleTransforms).toBeDefined();
            expect(_.isFunction(handleTransforms)).toBe(true);
        });

        it("should apply a given function to the given passage and story", function() {
            var passage = {
                text: "this is pre-transform"
            };
            handleTransforms(passage, {}, (p) => {
                p.text = "this is post-transform";
            });
            expect(passage.text).toEqual("this is post-transform");
        });

        it("should also be able to apply an array of functions", function() {
            var passage = {
                text: "I am noodle"
            };
            var transforms = [
                (p) => {
                    p.text += " pasta";
                },
                (p) => {
                    p.text += " lumbago";
                },
                (p) => {
                    p.text += " shortening!";
                }
            ];
            handleTransforms(passage, {}, transforms);
            expect(passage.text).toEqual("I am noodle pasta lumbago shortening!");
        });
    });


});