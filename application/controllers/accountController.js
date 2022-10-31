const AccountContract = require('../contract/accountContract');
const ControllerUtil = require('./ControllerUtil.js');
const ConnectService = require('./../services/connectService.js');
const BiocoinContract = require('../contract/biocoinContract.js');
const BalanceInsuficient = require('../errors/balanceInsuficient.js')
const Dinero = require('dinero.js')

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

exports.newTransfer = async function (req, res, next){
  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  account.balance = Dinero({ amount: account.balance, precision: 9 }).toFormat('0.000000000')
  account.created_at = ControllerUtil.formatDate(new Date(account.created_at))
  res.render('account/new-transfer', { account })
}

exports.createTransfer = async function (req, res, next){
  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  const transferData ={senderAddress: req.body.senderAddress, receiverAddress: req.body.receiverAddress, amount: req.body.amount}
  const biocoinContract = new BiocoinContract();
try {
    await biocoinContract.transferBiocoins(transferData.senderAddress, transferData.receiverAddress, (transferData.amount)*1e9)
 } catch (e){
  let message = ControllerUtil.getMessageFromError(e)
    res.render('account/transfer/transfer-error', {message} )
    return
  }
  res.render('account/transfer/transfer-sucess', {transferData, account} )
}

function formatAccount(account){
  account.balance = ControllerUtil.formatMoney(account.balance)
  account.created_at = ControllerUtil.formatDate(new Date(account.created_at))
  account.tokens = account.tokens.map((token) => {
    token.value = ControllerUtil.formatMoney(token.value)
    return token
  })
  return account
}

