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

});