const KeyguardService = require('../services/keyguardService');

exports.readDnaKey = async function(req, res, next){
  const dnaKey = { dnaId:"125", secretKey:"mysecretKey125" }

  res.render('dnaKey/show', { dnaKey });
};

