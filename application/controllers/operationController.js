const OperationContract = require('../contract/operationContract');
const ControllerUtil = require('./ControllerUtil.js');

exports.create = async function(req, res, next){
  const operation = createOperationFromRequest(req);

  const operationContract = new OperationContract();
  await operationContract.createOperation(operation)
  res.redirect("/operation/" + operation.id)
};

exports.show = async function(req, res, next){
  const operationContract = new OperationContract();
  const operation = await operationContract.readOperation(req.params.operation)

  operation.created_at = ControllerUtil.formatDate(new Date(operation.created_at))
  operation.type = ControllerUtil.formatOperationType(operation.type)

  res.render('operation/show', { operation });
};

function createOperationFromRequest(req){
  return {
    id: ControllerUtil.generateId(),
    data_id: req.body.data_id,
    type: 'buy',
    user: 'Toshi',
    created_at: new Date().toDateString(),
    details: {
      price: req.body.price,
      seller: req.body.collector
    }
  }
}
