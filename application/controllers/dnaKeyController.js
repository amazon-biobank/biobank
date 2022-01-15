const KeyguardService = require('../services/keyguardService');

exports.readDnaKey = async function(req, res, next){
  const dnaKey = await KeyguardService.readDnaKey(req.params.dnaId, (response) => {
    if(response.statusCode == 200){
      const dnaKey = JSON.parse(response.data)
      res.render('dnaKey/show', { dnaKey });
    } else {
      req.flash('error', response.data)
      res.redirect('back')
    }
  })
};

