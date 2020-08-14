const DataContract = require('../contract/dataContract');

exports.index = async function(req, res, next){
  res.render('home/home', { });
};

