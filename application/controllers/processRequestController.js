const ProcessRequestContract = require('../contract/processRequestContract');
const DataContract = require('../contract/dataContract');
const ProcessorContract = require('../contract/processorContract');
const ControllerUtil = require('./ControllerUtil.js');

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

  res.render('processRequest/show', { processRequest });
};

exports.create = async function(req, res, next){
  let processRequest = createProcessorRequestFromRequest(req);

  const processRequestContract = new ProcessRequestContract();
  await processRequestContract.createProcessRequest(processRequest)

  res.redirect("/process-request/" + processRequest.id)
};

function createProcessorRequestFromRequest(req){
  return {
    id: ControllerUtil.generateId(),
    raw_data_id: req.body.raw_data_id,
    processor_id: req.body.processor_id,
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
  const processorContract = new ProcessorContract();
  processRequest.raw_data = await dataContract.readData(processRequest.raw_data_id);
  processRequest.processor = await processorContract.readProcessor(processRequest.processor_id)
  if (processRequest.processed_data_id){
    processRequest.processed_data = await dataContract.readData(processRequest.processed_data_id);
  }
  return processRequest
}
