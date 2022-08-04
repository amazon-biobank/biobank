const DataContract = require('../contract/dataContract');
const ControllerUtil = require('./ControllerUtil.js');
const DataService = require('./../services/dataService')
const dataController = require('./dataController')


exports.index = async function(req, res, next){
  const dataContract = new DataContract();
  const datas = await dataContract.getAllData();

  const formattedDatas = datas.map(function(data){
    return {
      id: data.id,
      type: ControllerUtil.formatDataType(data.type),
      metadata: {
        title: data.metadata.title,
        description: data.metadata.description,
      },
      collector: data.collector,
      created_at: ControllerUtil.formatDate(new Date(data.created_at)),
      price: data.price
    }
  })

  res.render('tk/index', { datas: formattedDatas });
};



  exports.newTkData = async function(req,res,next){
    const queryParams = { processRequestId: req.query.processRequest}
    res.render('data/tradicional-knowledge-new', { queryParams });
  }
  
  exports.createTkData = async function(req,res,next){  
    const TkData = await handleCreateTkData(req, res)
    if(TkData == undefined){ return }
  
    await handleRegisterDnaKey(req, res, TkData.id)
  
    
    if(req.body.process_request_id) {
      await DataService.updateProcessRequest(req.body.process_request_id, TkData)
    }
  };
 
  async function handleCreateTkData(req, res){
    try{  
      const TkData = await DataService.createTkData(req)
      return TkData
    } catch (error){
      req.flash('error', ControllerUtil.getMessageFromError(error))
      res.redirect("back")
      return
    }
  }
  
  async function handleRegisterDnaKey(req, res, dnaId){
    await KeyguardService.registerDnaKey(dnaId, req.body.secret_key, (response) => {
      req.flash('success', "Dna created with sucess")
      res.redirect("/tk/" + dnaId)
    }, 
    (error) => {
      req.flash('error', error.message)
      res.redirect("/tk/" + dnaId)
    })  
  }

  
exports.show = async function(req, res, next){
  const dataId = req.params.dataId;
  const dataContract = new DataContract();
  const data = await dataContract.readData(dataId);
  const dnaContract = await getDnaContract(data.dna_contract)

  data.type = ControllerUtil.formatDataType(data.type);
  data.status = ControllerUtil.formatDataStatus(data.status);
  data.created_at = ControllerUtil.formatDate(new Date(data.created_at));

  res.render('tk/show', { data, dnaContract });
};


exports.listOperations = async function(req, res, next){
  const dataId = req.params.dataId;
  const dataContract = new DataContract();
  const data = await dataContract.readData(dataId);
  const operations = await dataContract.getAllOperation(req.params.dataId);

  const formattedOperations = operations.map(function(operation){
    return {
      userAddress: operation.userAddress,
      id: operation.id,
      type: ControllerUtil.formatOperationType(operation.type),
      created_at: ControllerUtil.formatDate(new Date(operation.created_at)),
    }
  })

  res.render('tk/list-operations', { data, operations: formattedOperations });
};
