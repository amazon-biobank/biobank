const DataContract = require('../contract/dataContract');
const ControllerUtil = require('./ControllerUtil.js');
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
      status: ControllerUtil.formatDataStatus(data.status, res.locals.language),
      price: data.price
    }
  })

  res.render('processableData/index', { datas: formattedDatas });
};

exports.show = async function(req, res, next){
  res.render('processableData/show', { });
};

exports.showData = async function(req, res, next){
  const dataId = req.params.dataId;
  const dataContract = new DataContract();
  const data = await dataContract.readData(dataId);
  const dnaContract = await getDnaContract(data.dna_contract)

  data.type = ControllerUtil.formatDataType(data.type);
  data.status = ControllerUtil.formatDataStatus(data.status, res.locals.language);
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

