const DataContract = require('../contract/dataContract');
const ControllerUtil = require('./ControllerUtil.js');
const AccountContract = require('../contract/accountContract');
const ConnectService = require('./../services/connectService.js');

const DnaContractContract = require('../contract/dnaContractContract');

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

exports.showData = async function(req, res, next){
  const dataId = req.params.dataId;
  const dataContract = new DataContract();
  const data = await dataContract.readData(dataId);
  const dnaContract = await getDnaContract(data.dna_contract)

  data.type = ControllerUtil.formatDataType(data.type);
  data.status = ControllerUtil.formatDataStatus(data.status);
  data.created_at = ControllerUtil.formatDate(new Date(data.created_at));

  res.render('processableData/show-data', { data, dnaContract} );
}

exports.showContract = async function(req, res, next){
  const dnaContractContract = new DnaContractContract();
  const dnaContract = await dnaContractContract.readDnaContract(req.params.dnaContract)

  dnaContract.created_at = ControllerUtil.formatDate(new Date(dnaContract.created_at))
  dnaContract.raw_data_price = ControllerUtil.formatMoney(dnaContract.raw_data_price)
  dnaContract.processed_data_price = ControllerUtil.formatMoney(dnaContract.processed_data_price)
  dnaContract.royalty_payments = dnaContract.royalty_payments.map((payment) => {
    payment.type = ControllerUtil.formatRoyaltyPaymentType(payment.type)
    return payment
  })
  res.render('processableData/show-contract', { dnaContract, flash: req.flash()  });
}

async function getDnaContract(dnaContractId){
  if(dnaContractId){
    const dnaContractContract = new DnaContractContract();
    return await dnaContractContract.readDnaContract(dnaContractId)
  }
}

