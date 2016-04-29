describe("readFile", function() {
    var readFile = require("../lib/readfile");
    const _ = require("underscore");

    it("should be a function", function() {
        expect(_.isFunction(readFile)).toBe(true);
    });

    it("should convert a given Twine story HTML file into objects", function(done) {
        var path = __dirname + "/support/test_story.html";
        readFile(path, {}).then((story) => {
            expect(story).toBeDefined();
            expect(story.ifid).toEqual("B3593454-5ADC-459D-982D-31E4A601EF01");
            expect(story.name).toEqual("My First Story");
            expect(story.startNode).toEqual(1);
            expect(story.format).toEqual("Snowman");
            expect(story.passages.length).toEqual(5);
            expect(story.passages[0].pid).toEqual(1);
            expect(story.passages[0].name).toEqual("My First Room");
            // check tag support
            expect(_.contains(story.passages[0].tags, "start")).toBe(true);
            expect(_.contains(story.passages[0].tags, "room")).toBe(true);
            expect(_.isArray(story.passages[1].tags)).toBe(true);
            expect(_.contains(story.passages[1].tags, "room")).toBe(true);
            done();
        }).catch((err) => {
            throw err;
        });
    });

    it("should accept an ignorePassages option", function() {
        var path = __dirname + "/support/test_story.html";
        readFile(path, {"ignorePassages": [1,2]}).then((story) => {
            expect(story).toBeDefined();
            expect(story.passages.length).toEqual(3);
            expect(story.passages[0].pid).toEqual(3);
            expect(story.passages[0].name).toEqual("My Bedroom");
            expect(story.passages[1].name).toEqual("My Bathroom");
            expect(story.passages[2].name).toEqual("My Closet");
            done();
        }).catch((err) => {
            throw err;
        });
    });
});