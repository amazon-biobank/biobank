const KeyguardService = require('../services/keyguardService');

exports.readDnaKey = async function(req, res, next){
    const dnaKey = await KeyguardService.readDnaKey(req.params.dnaId, (response) => {
        const dnaKey = JSON.parse(response.data)
        res.render('dnaKey/show', { dnaKey });
      }, 
      (error) => {
        req.flash('error', error.message)
        res.redirect('back')
      } 
    )
};


