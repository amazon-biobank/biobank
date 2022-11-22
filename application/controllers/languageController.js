
exports.backEnglish = async function(req, res, next){
    await english()
    res.redirect('/');
};

exports.backPortuguese = async function(req, res, next){
    await portuguese()
    res.redirect('/');
};

async function english(){
    language = 0;
    return language;
}

async function portuguese(){
    language = 1;
    return language;
}