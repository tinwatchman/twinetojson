describe("twineToJSON", function() {
    var twineToJSON = require("../twine_to_json");
    const fs = require("fs");
    const _ = require("underscore");

    it("should exist and be a function", function() {
        expect(twineToJSON).toBeDefined();
        expect(_.isFunction(twineToJSON)).toBe(true);
    });

    it("should take a Twine HTML file and create a JSON file", function(done) {
        var outPath = __dirname + "/support/output.json";
        var options = {
            "in": __dirname + "/support/test_story.html",
            "out": outPath,
            "prettyPrint": true
        };
        twineToJSON(options).then((storyObj) => {
            expect(storyObj).toBeDefined();
            fs.readFile(outPath, {"encoding":"utf8"}, (err, data) => {
                expect(err).toBe(null);
                expect(data).toBeDefined();
                fs.readFile(__dirname + "/support/expected_output.json", {"encoding":"utf8"}, (err, expected) => {
                    expect(data).toEqual(expected);
                    // clean up
                    fs.unlink(outPath, (err) => {
                        done();
                    });
                });
            });
        }).catch((err) => {
            done.fail(err);
        });
    });
});