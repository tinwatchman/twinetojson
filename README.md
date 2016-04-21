TWINE TO JSON
=============

> A basic utility library / script to convert a Twine story file into a more 
> easily parseable JSON format. Useable as both a Node library and as a command
> line tool.

## Install

``` bash
npm install twine_to_json --save
```

## Usage

To use from the command line, see:

``` bash
twinetojson --help
```

To use as a library with default values:

``` js
var twineToJSON = require("twine_to_json");
twineToJSON({
   in: "path_to_story_file",
   out: "path_to_write_JSON_file",
   ignoreComments: false,
   renderMarkdown: true,
   writeToFile: true,
   prettyPrint: false,
   callback: function(err, story) { // optional }
}).then(function(story) {
    // ...
}).catch(function(err) {
    // ...
});
```

## twineToJSON(options)

### options

Type: `Object`

Hash of options. See below for details.

## Options

### in

Type: `String`

Path to the Twine story file. Required.

### out

Type: `String`

Path to output the JSON file to. Defaults to the current working directory.

### ignoreComments

Type: `Boolean`

Whether or not to remove block comments (i.e. `/* */`). Defaults to false.

### renderMarkdown

Type: `Boolean`

Whether or not to render Markdown in story passages. Defaults to true.

### writeToFile

Type: `Boolean`

Whether or not to write the JSON file to disk. Defaults to true.

### prettyPrint

Type: `Boolean`

Whether or not to write the JSON file in a human-readable format. Defaults to 
false.

### callback

Type: `Function`

Standard callback function for those who don't like Promises. Optional.

## License

Created by [Jon Stout](http://www.jonstout.net). Licensed under [the MIT license](http://opensource.org/licenses/MIT).
