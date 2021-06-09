const AccountContract = require('../contract/accountContract');
const ControllerUtil = require('./ControllerUtil.js');
const ConnectService = require('./../services/connectService.js');
const Dinero = require('dinero.js')

exports.show = async function(req, res, next){

  const accountContract = new AccountContract();
  const account = await accountContract.readAccount(req.params.account)

  if(account == null) {
    res.render('5xx')
    return
  }

  account.balance = Dinero({ amount: account.balance, precision: 9 }).toFormat('0.000000000')
  account.created_at = ControllerUtil.formatDate(new Date(account.created_at))
  res.render('account/show', { account });
};

exports.showMyAccount = async function(req, res, next){
  console.log('showmyaccount')
  const connectService = new ConnectService()
  const myAddress = await connectService.getMyAddress()
  console.log(myAddress)
  res.redirect('/account/'+ myAddress)
};




