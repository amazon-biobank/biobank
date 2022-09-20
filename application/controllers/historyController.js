const ControllerUtil = require('./ControllerUtil.js');
const DataContract = require('../contract/dataContract');

exports.dataQuery = async function(req, res, next){
  res.render("history/dataQuery", { })
};

exports.dataSearch = async function(req, res, next){
  res.redirect("/history/data/" + req.body.dataId )
};

exports.dataBuyQuery = async function(req, res, next){
  res.render("history/dataBuyQuery", { })
};

exports.dataBuySearch = async function(req, res, next){
  res.redirect("/history/data-buy/" + req.body.dataId )
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

  res.render('history/dataShow', { dataHistory: formattedDataHistory });
};

exports.dataBuyShow = async function(req, res, next){
  const dataContract = new DataContract();
  const dataHistory = await dataContract.getDataHistory(req.params.dataId);

  const formattedDataHistory = dataHistory.map(function(history){
    history.state.type = ControllerUtil.formatDataType(history.state.type);
    if(history.state.type == "Raw")  
        history.state.created_at = ControllerUtil.formatDate(new Date(history.state.created_at));
        history.timestamp = ControllerUtil.formatCompleteDate(new Date(history.timestamp_in_seconds * 1000))
        return history
  })

  res.render('history/dataBuyShow', { dataHistory: formattedDataHistory });
};


