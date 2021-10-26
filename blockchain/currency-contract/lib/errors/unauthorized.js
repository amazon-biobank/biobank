'use strict';

class Unauthorized extends Error{
    constructor(id){
        super("[Error] Unauthorized account");
        this.name = "UnauthorizedError";
    }
}

module.exports = Unauthorized;