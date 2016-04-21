"use strict";

class Story {

    constructor() {
        this.ifid = null;
        this.name = null;
        this.startNode = -1;
        this.creator = null;
        this.creatorVersion = null;
        this.format = null;
        this.passages = [];
    }

}

class Passage {

    constructor() {
        this.pid = -1;
        this.name = null;
        this.text = null;
        this.links = [];
    }

}

class Link {

    constructor() {
        this.id = null;
        this.label = null;
        this.passageId = null;
    }

}

module.exports = {
    "Story": Story,
    "Passage": Passage,
    "Link": Link
};