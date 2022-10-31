const DataContract = require('../contract/dataContract');
const AccountContract = require('../contract/accountContract');
const ConnectService = require('./../services/connectService.js');
const ControllerUtil = require('./ControllerUtil.js');

exports.index = async function(req, res, next){
  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = ControllerUtil.formatAccount(account)
  
  res.render('home/home', { account : formattedAccount }); 
};
