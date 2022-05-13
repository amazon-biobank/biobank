'use strict';

class TesteError extends Error{
    constructor(id){
        super("[Error] " + id);
        this.name = "TesteError";
    }
}

module.exports = TesteError;