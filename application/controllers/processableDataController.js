const DataContract = require('../contract/dataContract');
const ControllerUtil = require('./ControllerUtil.js');

exports.index = async function(req, res, next){
  const dataContract = new DataContract();
  const datas = await dataContract.getAllRawData();

  const formattedDatas = datas.map(function(data){
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      collector: data.collector,
      created_at: ControllerUtil.formatDate(new Date(data.created_at)),
      process_reward: data.process_reward,
      status: ControllerUtil.formatDataStatus(data.status),
      price: data.price
    }
  })

  res.render('processableData/index', { datas: formattedDatas  });
};

exports.show = async function(req, res, next){
  res.render('processableData/show', {  });
};
