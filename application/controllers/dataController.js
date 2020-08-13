const DataContract = require('../contract/dataContract');
const ControllerUtil = require('./ControllerUtil.js');

exports.index = async function(req, res, next){
  const dataContract = new DataContract();
  const datas = await dataContract.getAllData();

  const formattedDatas = datas.map(function(data){
    return {
      type: ControllerUtil.formatDataType(data.type),
      title: data.title,
      description: data.description,
      collector: data.collector,
      created_at: ControllerUtil.formatDate(new Date(data.created_at)),
      price: data.price
    }
  })

  res.render('data/index', { datas: formattedDatas });
};


exports.newRawData = async function(req, res, next){

  res.render('data/raw-data-new', { });
};

exports.newProcessedData = async function(req, res, next){

  res.render('data/processed-data-new', { });
};

exports.createRawData = async function(req, res, next){

  res.render('data/raw-data-new', { });
};

exports.createProcessedData = async function(req, res, next){

  res.render('data/processed-data-new', { });
};

exports.show = async function(req, res, next){

  res.render('data/show', { });
};