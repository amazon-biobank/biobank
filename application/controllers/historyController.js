const ControllerUtil = require('./ControllerUtil.js');
const DataContract = require('../contract/dataContract');
const AccountContract = require('../contract/accountContract');
const ConnectService = require('./../services/connectService.js');

exports.dataQuery = async function(req, res, next){
  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = ControllerUtil.formatAccount(account)

  res.render("history/dataQuery", { account: formattedAccount})
};

exports.dataSearch = async function(req, res, next){
  res.redirect("/history/data/" + req.body.dataId )
};

exports.dataShow = async function(req, res, next){
  const dataContract = new DataContract();
  const dataHistory = await dataContract.getDataHistory(req.params.dataId);

  const formattedDataHistory = dataHistory.map(function(history){
    history.state.type = ControllerUtil.formatDataType(history.state.type);
    history.state.created_at = ControllerUtil.formatDate(new Date(history.state.created_at));
    history.timestamp = ControllerUtil.formatCompleteDate(new Date(history.timestamp_in_seconds * 1000))
    return history
  })

  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = ControllerUtil.formatAccount(account)

  res.render('history/dataShow', { dataHistory: formattedDataHistory, account: formattedAccount});
};

