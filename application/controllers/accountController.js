const AccountContract = require('../contract/accountContract');
const ControllerUtil = require('./ControllerUtil.js');

exports.show = async function(req, res, next){

  const accountContract = new AccountContract();
  const account = await accountContract.readAccount(req.params.account)

  if(account == null) {
    res.render('5xx')
    return
  }

  account.created_at = ControllerUtil.formatDate(new Date(account.created_at))
  res.render('account/show', { account });
};




