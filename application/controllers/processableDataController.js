const DataContract = require('../contract/dataContract');
const ControllerUtil = require('./ControllerUtil.js');
const AccountContract = require('../contract/accountContract');
const ConnectService = require('./../services/connectService.js');

exports.index = async function(req, res, next){
  const dataContract = new DataContract();
  const datas = await dataContract.getAllRawData();
  const filteredDatas = datas.filter((data) => {return data.status=='unprocessed'})

  const formattedDatas = filteredDatas.map(function(data){
    return {
      id: data.id,
      metadata:{
        title: data.metadata.title,
        description: data.description
      },
      collector: data.collector,
      created_at: ControllerUtil.formatDate(new Date(data.created_at)),
      status: ControllerUtil.formatDataStatus(data.status),
      price: data.price
    }
  })

  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = ControllerUtil.formatAccount(account)

  res.render('processableData/index', { datas: formattedDatas, account: formattedAccount});
};

exports.show = async function(req, res, next){
  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = ControllerUtil.formatAccount(account)

  res.render('processableData/show', { account: formattedAccount});
};
