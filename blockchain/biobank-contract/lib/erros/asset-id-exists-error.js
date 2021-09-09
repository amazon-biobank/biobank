'use strict';

class AssetIdExistsError extends Error{
    constructor(id){
        super("ID: " + id + " already exists");
        this.name = "AssetIdExistsError";
    }
}

module.exports = AssetIdExistsError;