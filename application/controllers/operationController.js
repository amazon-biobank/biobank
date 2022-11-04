const OperationContract = require('../contract/operationContract');
const ControllerUtil = require('./ControllerUtil.js');
const OperationService = require('./../services/operationService.js');
const AccountContract = require('../contract/accountContract');
const ConnectService = require('./../services/connectService.js');


exports.create = async function(req, res, next){
  const operation = createOperationFromRequest(req);

  const operationContract = new OperationContract();
  await operationContract.createOperation(operation)

  if (req.body.type == 'buy') {
    await new OperationService().addUserInDataOwner(req.body.data_id, 'Buyer User')
  }
  res.redirect("/operation/" + operation.id)
};

exports.show = async function(req, res, next){
  const operationContract = new OperationContract();
  const operation = await operationContract.readOperation(req.params.operation)

  const formattedOperation = formatOperation(operation)

  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = ControllerUtil.formatAccount(account)

  res.render('operation/show', { operation: formattedOperation, account: formattedAccount});
};

function createOperationFromRequest(req){
  return {
    id: ControllerUtil.generateId(),
    data_id: req.body.data_id,
    type: req.body.type,
    user: 'Toshi',
    created_at: new Date().toDateString(),
    details: {
      price: req.body.price,
      seller: req.body.collector
    }
  }
}

function formatOperation(operation){
  operation.input = operation.input.map((input) => {
    input.value = ControllerUtil.formatMoney(input.value)
    return input
  })
  operation.output = operation.output.map((output) => {
    output.value = ControllerUtil.formatMoney(output.value)
    return output
  })
  operation.created_at = ControllerUtil.formatDate(new Date(operation.created_at))
  operation.type = ControllerUtil.formatOperationType(operation.type)

  return operation
}
