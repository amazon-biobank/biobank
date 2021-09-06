'use strict';

class AssetExists extends Error{
    constructor(id){
        super("ID: " + id + " already exists");
        this.name = "AssetExists";
    }
}

module.exports = AssetExists;