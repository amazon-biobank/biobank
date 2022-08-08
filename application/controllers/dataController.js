const DataContract = require('../contract/dataContract');
const DnaContractContract = require('../contract/dnaContractContract');
const ControllerUtil = require('./ControllerUtil.js');
const KeyguardService = require('../services/keyguardService');
const DataService = require('./../services/dataService')
const ProcessRequestContract = require('./../contract/processRequestContract')
const ProcessTokenContract = require('./../contract/processTokenContract')

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

  res.render('data/index', { datas: formattedDatas });
};


exports.newRawData = async function(req, res, next){
  res.render('data/raw-data-new', { });
};


exports.createRawData = async function(req, res, next){
  const rawData = await handleCreateRawData(req, res)
  if(rawData == undefined){ return }

  await handleRegisterDnaKey(req, res, rawData.id)
};


exports.newProcessedData = async function(req, res, next){
  const queryParams = { processRequestId: req.query.processRequest}
  res.render('data/processed-data-new', { queryParams });
};


exports.createProcessedData = async function(req, res, next){
  if(req.body.process_request_id != null){
    await redeemToken(req, res)
  }

  const processedData = await handleCreateProcessedData(req, res)
  if(processedData == undefined){ return }

  await handleRegisterDnaKey(req, res, processedData.id)

  if(req.body.process_request_id) {
    await DataService.updateProcessRequest(req.body.process_request_id, processedData)
  }
};


exports.show = async function(req, res, next){
  const dataId = req.params.dataId;
  const dataContract = new DataContract();
  const data = await dataContract.readData(dataId);
  const dnaContract = await getDnaContract(data.dna_contract)

  data.type = ControllerUtil.formatDataType(data.type);
  data.status = ControllerUtil.formatDataStatus(data.status);
  data.created_at = ControllerUtil.formatDate(new Date(data.created_at));

  res.render('data/show', { data, dnaContract });
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

  res.render('data/list-operations', { data, operations: formattedOperations });
};





//---------------------- Auxiliary functions --------------------------//

async function handleCreateRawData(req, res){
  try {
    const rawData = await DataService.createRawData(req)
    return rawData
  } catch (error){
    req.flash('error', ControllerUtil.getMessageFromError(error))
    res.redirect("back")
    return
  }
}

async function handleCreateProcessedData(req, res){
  try{
    const processedData = await DataService.createProcessedData(req)
    return processedData
  } catch (error){
    req.flash('error', ControllerUtil.getMessageFromError(error))
    res.redirect("back")
    return
  }

}

async function handleRegisterDnaKey(req, res, dnaId){
  await KeyguardService.registerDnaKey(dnaId, req.body.secret_key, (response) => {
    req.flash('success', "Dna created with sucess")
    res.redirect("/data/" + dnaId)
  }, 
  (error) => {
    req.flash('error', error.message)
    res.redirect("/data/" + dnaId)
  })  
}

async function redeemToken(req, res){
  const processRequestContract = new ProcessRequestContract();
  const processTokenContract = new ProcessTokenContract()

  let processRequest = await processRequestContract.readProcessRequest(req.body.process_request_id)
  let attributes = {accountId: processRequest.processor_id, processRequestId: req.body.process_request_id  }
  let processTokenAttributes = JSON.stringify(attributes)
  await processTokenContract.redeemProcessToken(processTokenAttributes)
}





async function getDnaContract(dnaContractId){
  if(dnaContractId){
    const dnaContractContract = new DnaContractContract();
    return await dnaContractContract.readDnaContract(dnaContractId)
  }
}

