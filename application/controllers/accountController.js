const AccountContract = require('../contract/accountContract');
const ControllerUtil = require('./ControllerUtil.js');
const ConnectService = require('./../services/connectService.js');

exports.show = async function(req, res, next){
  const accountContract = new AccountContract();
  const account = await accountContract.readAccount(req.params.account)

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = formatAccount(account)
  res.render('account/show', { account: formattedAccount });
};

exports.showMyAccount = async function(req, res, next){
  console.log('showmyaccount')
  const connectService = new ConnectService()
  const myAddress = await connectService.getMyAddress()
  console.log(myAddress)
  res.redirect('/account/'+ myAddress)
};

function formatAccount(account){
  account.balance = ControllerUtil.formatMoney(account.balance)
  account.created_at = ControllerUtil.formatDate(new Date(account.created_at))
  account.tokens = account.tokens.map((token) => {
    token.value = ControllerUtil.formatMoney(token.value)
    return token
  })
  return account
}



