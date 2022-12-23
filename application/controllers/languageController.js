
exports.backEnglish = async function(req, res, next){
    await english(res)
    res.redirect('/');
};

exports.backPortuguese = async function(req, res, next){
    await portuguese(res)
    res.redirect('/');
};

async function english(res){
    res.cookie('language', 'en', { maxAge: 900000 })
    return 
}

async function portuguese(res){
    res.cookie('language', 'pt', { maxAge: 900000 })
    return 
}