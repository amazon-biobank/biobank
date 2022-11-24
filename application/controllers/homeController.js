const AccountContract = require('../contract/accountContract');
const ConnectService = require('./../services/connectService.js');
const ControllerUtil = require('./ControllerUtil.js');
const { application } = require('express');

exports.index = async function(req, res, next){
  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  const formattedAccount = ControllerUtil.formatAccount(account)

  req.app.locals.account = formattedAccount //insert username in certificate in app variable 'app.locals.account'; 
                                            //it will make the username available in app templates in the app

  res.render('home/home', { }); 
};
