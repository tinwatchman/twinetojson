TWINE TO JSON
=============

> A basic utility library / script to convert a [Snowman](https://bitbucket.org/klembot/snowman-2)-formatted 
> [Twine](https://twinery.org/) story file into a more easily parseable JSON 
> format. Useable as both a Node library and as a command line tool.

**NOTE: This library is still currently in development! Use at your own risk!**

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
   ignorePassages: [],
   transformPassages: [],
   customTags: [],
   linkFormat: null,
   callback: function(err, story) { /* optional */ }
}).then(function(story) {
    // ...
}).catch(function(err) {
    // ...
});
```

## twineToJSON(options)

**Returns:** `Promise`

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

### ignorePassages

Type: `Array` of Numbers

An array of passage ids (pids) to exclude from processing. Allows certain 
passages to be skipped over. These passages will not be parsed and will not 
appear in the final JSON output.

#### Usage

```js
twineToJSON({
   ignorePassages: [ 1, 2, 3 ] // ids to ignore
   // ...
});
```

### transformPassages

Type: `Function` or `Array` of Functions

A function or array of functions to apply to a passage. The function(s) will be
provided with two arguments: `passage` (the `Passage` object) and `story` (the
`Story` object). Note that any transform functions will be run on the passage
**before** any other processing or parsing is done!

#### Usage

```js
twineToJSON({
    transformPassages: function(passage, story) {
        // do something to the passage text here...
    },
    // or:
    transformPassages: [
        (passage, story) => {
            // do something to passage here
        },
        (passage, story) => {
            // do something to passage here
        },
        (passage, story) => {
            // etc.
        }
    ]
});
```

### customTags

Type: `Array` of Objects

Allows the replacement of custom HTML tags within the passage text. Each object
specifies the custom tag to replace. It should/can have the following 
properties:

- **name**: (`String`) the tag's name [required]
- **swap**: (`String`) an HTML string to swap the tag with. The tag's children 
    will be appended to the elements in the string.

#### Usage

```js
twineToJSON({
    // ...
    customTags: [
        {
            name: "options",
            swap: '<div class="options"></div>'
            // this will take anything within an <options> tag, wrap it in a 
            // <div> with class 'options', and replace the original tag.
        }
    ] 
});
```

### linkFormat

Type: `Function` or `String`

Specifies how to format the links in the passage text. Can be either an 
[Underscore template string](http://underscorejs.org/#template) or a function. 
Functions will be given an object with three properties:

* `id`: String representing a generated unique identifier for the link.
* `label`: String representing the link's intended display text.
* `passageId`: the `pid` of the passage the link goes to.

#### Usage

```js
twineToJSON({
    // ...
    linkFormat: function(link) {
      return '<a data-passage="' + link.passageId + '">' + link.label + '</a>';
    },
    // or as Underscore template string
    linkFormat: '<a id="<%=id%>" data-passage="<%=passageId%>"><%=label%></a>'
});
```

### callback

Type: `Function`

Standard callback function for those who don't like Promises. Optional.

## Tests

``` bash
npm test
```

## License

Created by [Jon Stout](http://www.jonstout.net). Licensed under [the MIT license](http://opensource.org/licenses/MIT).
