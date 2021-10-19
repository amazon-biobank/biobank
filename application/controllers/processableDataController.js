const DataContract = require('../contract/dataContract');
const ControllerUtil = require('./ControllerUtil.js');

exports.index = async function(req, res, next){
  const dataContract = new DataContract();
  const datas = await dataContract.getAllRawData();
  const filteredDatas = datas.filter((data) => {return data.status=='processed'})

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

  console.log(formattedDatas)
  res.render('processableData/index', { datas: formattedDatas  });
};

exports.show = async function(req, res, next){
  res.render('processableData/show', {  });
};
