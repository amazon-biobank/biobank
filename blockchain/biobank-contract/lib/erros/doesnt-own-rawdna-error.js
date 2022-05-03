'use strict';

class DoesntOnwRawDNAError extends Error{
    constructor(rawDNAid){
        super("User  doesn't own raw DNA: " + rawDNAid);
        this.name = "DoesntOnwRawDNAError";
    }
}

module.exports = DoesntOnwRawDNAError;