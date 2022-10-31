const ProcessRequestContract = require('../contract/processRequestContract');
const DataContract = require('../contract/dataContract');
const AccountContract = require('../contract/accountContract');
const ControllerUtil = require('./ControllerUtil.js');
const ConnectService = require('./../services/connectService.js');

exports.index = async function(req, res, next){
  const processRequestContract = new ProcessRequestContract();
  const processRequests = await processRequestContract.getAllProcessRequest();

  const formattedProcessRequests = await Promise.all(processRequests.map(async function(processRequest){
    await getDataAndProcessorForProcessRequest(processRequest)
    formatProcessRequest(processRequest)
    return processRequest
  }))

  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = ControllerUtil.formatAccount(account)

  res.render('processRequest/index', { processRequests: formattedProcessRequests, account: formattedAccount });
};

exports.show = async function(req, res, next){
  const processRequestContract = new ProcessRequestContract();

  const processRequest = await processRequestContract.readProcessRequest(req.params.processRequestId)
  await getDataAndProcessorForProcessRequest(processRequest)
  formatProcessRequest(processRequest)

  console.log(processRequest)

  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = ControllerUtil.formatAccount(account)

  res.render('processRequest/show', { processRequest, account: formattedAccount });
};

exports.create = async function(req, res, next){
  const processRequestContract = new ProcessRequestContract();
  const dataContract = new DataContract();
  
  let processRequest = createProcessorRequestFromRequest(req);
  await processRequestContract.createProcessRequest(processRequest)
  await dataContract.addProcessRequest(processRequest.raw_data_id, processRequest.id)

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
