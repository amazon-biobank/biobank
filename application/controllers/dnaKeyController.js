const KeyguardService = require('../services/keyguardService');
const AccountContract = require('../contract/accountContract');
const ConnectService = require('./../services/connectService.js');
const ControllerUtil = require('./ControllerUtil.js');

exports.readDnaKey = async function(req, res, next){
  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = ControllerUtil.formatAccount(account)

    const dnaKey = await KeyguardService.readDnaKey(req.params.dnaId, (response) => {
        const dnaKey = JSON.parse(response.data)
        res.render('dnaKey/show', { dnaKey, account: formattedAccount});
      }, 
      (error) => {
        req.flash('error', error.message)
        res.redirect('back')
      } 
    )
};


