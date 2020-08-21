const DataContract = require('../contract/dataContract');
const ControllerUtil = require('./ControllerUtil.js');

exports.index = async function(req, res, next){
  const dataContract = new DataContract();
  const datas = await dataContract.getAllData();

  const formattedDatas = datas.map(function(data){
    return {
      id: data.id,
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
  let rawData = createRawDataFromRequest(req);

  const dataContract = new DataContract();
  await dataContract.createRawData(rawData)

  res.redirect("/data/" + rawData.id)
};

exports.createProcessedData = async function(req, res, next){
  res.render('data/processed-data-new', { });
};

exports.show = async function(req, res, next){
  const dataId = req.params.dataId;

  const dataContract = new DataContract();
  const data = await dataContract.readData(dataId);

  data.type = ControllerUtil.formatDataType(data.type);
  data.created_at = ControllerUtil.formatDate(new Date(data.created_at));

  res.render('data/show', { data });
};

exports.listOperations = async function(req, res, next){
  const dataId = req.params.dataId;

  const dataContract = new DataContract();
  const data = await dataContract.readData(dataId);
  const operations = await dataContract.getAllOperation(req.params.dataId);

  const formattedOperations = operations.map(function(operation){
    return {
      user: operation.user,
      id: operation.id,
      type: ControllerUtil.formatOperationType(operation.type),
      created_at: ControllerUtil.formatDate(new Date(operation.created_at)),
    }
  })

  res.render('data/list-operations', { data, operations: formattedOperations });
};

function createRawDataFromRequest(req){
  // DEFAULT VARIABLES, MUST BE CHANGED
  let collector = 'USER X'
  let default_price = 100
  return {
    type : 'raw_data',
    id: ControllerUtil.generateId(),
    title: req.body.name,
    url: req.body.url,
    description: req.body.description,
    collector: collector,
    owners: [collector],
    price: default_price,
    created_at: new Date().toDateString(),
    conditions: ''
  }
}
