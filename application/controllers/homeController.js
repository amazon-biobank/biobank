const DataContract = require('../contract/dataContract');

exports.index = async function(req, res, next){
  // const dataContract = new DataContract();
  // const data = await dataContract.readData("raw_data", "1");
  res.render('home/home', {  });
};

