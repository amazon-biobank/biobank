
const DataContract = require('../contract/dataContract');
const ControllerUtil = require('../controllers/ControllerUtil');
const ProcessRequestContract = require('../contract/processRequestContract');


class DataService {
  static async createRawData(req){
    const rawData = createRawDataFromRequest(req);
    const dataContract = new DataContract();
    await dataContract.createRawData(rawData)
    return rawData
  }

  static async createProcessedData(req){
    const processedData = createProcessedDataFromRequest(req);
    const dataContract = new DataContract();
    await dataContract.createProcessedData(processedData);
    return processedData
  }

  static async updateProcessRequest(processRequestId, processedData){
    const processRequestContract = new ProcessRequestContract()
    let processRequest = await processRequestContract.readProcessRequest(processRequestId);
    processRequest.status = 'processed';
    processRequest.processed_data_id = processedData.id;
    await processRequestContract.updateProcessRequest(processRequest);
    return processRequest
  }
}

function createRawDataFromRequest(req){
  const magnetic = removeTracker(req.body.metadata.magnet_link);
  return {
    type : 'raw_data',
    id: ControllerUtil.getHashFromMagneticLink(req.body.metadata.magnet_link),
    metadata: {
      title: req.body.metadata.title,
      magnet_link: magnetic,
      description: req.body.metadata.description
    },
    status: 'unprocessed',
    created_at: new Date().toDateString()
  }
}

function createProcessedDataFromRequest(req){
  return {
    type : 'processed_data',
    id: ControllerUtil.getHashFromMagneticLink(req.body.metadata.magnet_link),
    status: 'processed',
    process_request_id: req.body.process_request_id,
    metadata: {
      title: req.body.metadata.title,
      magnet_link: req.body.metadata.magnet_link,
      description: req.body.metadata.description
    },
    created_at: new Date().toDateString()
  }
}

function removeTracker(magnet_link){
  const separator = magnet_link.split('&');
  return separator[0];
}

module.exports = DataService;
