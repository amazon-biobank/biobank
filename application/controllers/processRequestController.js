const ProcessRequestContract = require('../contract/processRequestContract');
const DataContract = require('../contract/dataContract');
const AccountContract = require('../contract/accountContract');
const ControllerUtil = require('./ControllerUtil.js');
const ProcessTokenContract = require('./../contract/processTokenContract')

exports.index = async function(req, res, next){
  const processRequestContract = new ProcessRequestContract();
  const processRequests = await processRequestContract.getAllProcessRequest();

  const formattedProcessRequests = await Promise.all(processRequests.map(async function(processRequest){
    await getDataAndProcessorForProcessRequest(processRequest)
    formatProcessRequest(processRequest)
    return processRequest
  }))

  res.render('processRequest/index', { processRequests: formattedProcessRequests });
};

exports.show = async function(req, res, next){
  const processRequestContract = new ProcessRequestContract();

  const processRequest = await processRequestContract.readProcessRequest(req.params.processRequestId)
  await getDataAndProcessorForProcessRequest(processRequest)
  formatProcessRequest(processRequest)

  console.log(processRequest)

  res.render('processRequest/show', { processRequest });
};

exports.create = async function(req, res, next){
  const processRequestContract = new ProcessRequestContract();
  const dataContract = new DataContract();

  //call channel 1
  // verify if the user is owner of the DNA 
  // if not, buy the DNA
  // and set the token attributes to the process token
  let processRequest = createProcessorRequestFromRequest(req);
  const processRequestCreated = await processRequestContract.createProcessRequest(processRequest)
  await dataContract.addProcessRequest(processRequest.raw_data_id, processRequest.id)

  //call channel 2

  const processTokenContract = new ProcessTokenContract()
  const processTokenAttributes = handleProcessTokenAttributes(processRequestCreated)
  await processTokenContract.createProcessToken(processTokenAttributes)

  req.flash('success', "Process Request created with sucess")
  res.redirect("/process-request/" + processRequest.id)
};

function createProcessorRequestFromRequest(req){

  return {
    id: ControllerUtil.generateId(),
    raw_data_id: req.body.raw_data_id,
    processed_data_id: req.body.processed_data_id,
    status: 'not_processed',
    created_at: new Date().toDateString()
  }
}

function formatProcessRequest(processRequest){
  processRequest.created_at = ControllerUtil.formatDate(new Date(processRequest.created_at))
  processRequest.status = ControllerUtil.formatProcessRequestStatus(processRequest.status);
  return processRequest
}

async function getDataAndProcessorForProcessRequest(processRequest){
  const dataContract = new DataContract();
  const accountContract = new AccountContract();
  processRequest.raw_data = await dataContract.readData(processRequest.raw_data_id);
  processRequest.processor = await accountContract.readAccount(processRequest.processor_id)
  if (processRequest.processed_data_id){
    processRequest.processed_data = await dataContract.readData(processRequest.processed_data_id);
  }
  return processRequest
}

function handleProcessTokenAttributes(processRequestCreated){
  const processTokenAttributes = {process_request_id: processRequestCreated.id, token_id: processRequestCreated.id, value: processRequestCreated.price,  owner: processRequestCreated.processor_id, raw_dna_id: processRequestCreated.raw_data_id}
  const final = JSON.stringify(processTokenAttributes)
  return final
}
