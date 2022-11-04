const ProcessorContract = require('../contract/processorContract');
const ControllerUtil = require('./ControllerUtil.js');
const AccountContract = require('../contract/accountContract');
const ConnectService = require('./../services/connectService.js');


exports.index = async function(req, res, next){
  const processorContract = new ProcessorContract();
  const processors = await processorContract.getAllProcessor();

  const formattedProcessors = processors.map(function(processor){
    processor.created_at = ControllerUtil.formatDate(new Date(processor.created_at))
    return processor
  })

  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = ControllerUtil.formatAccount(account)

  res.render('processor/index', { processors: formattedProcessors, account: formattedAccount });
};


exports.new = async function(req, res, next){
  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = ControllerUtil.formatAccount(account)

  res.render('processor/new', { account: formattedAccount });
};

exports.create = async function(req, res, next){
  let processor = createProcessorFromRequest(req);

  const processorContract = new ProcessorContract();
  await processorContract.createProcessor(processor)

  res.redirect("/processor/" + processor.id)
};

exports.show = async function(req, res, next){
  const processorContract = new ProcessorContract();
  const processor = await processorContract.readProcessor(req.params.processor)

  processor.created_at = ControllerUtil.formatDate(new Date(processor.created_at))

  const accountContract = new AccountContract();
  const connectService = new ConnectService()
  const account = await accountContract.readAccount(await connectService.getMyAddress())

  if(account == null) {
    res.render('5xx')
    return
  }

  const formattedAccount = ControllerUtil.formatAccount(account)

  res.render('processor/show', { processor, account: formattedAccount});
};

function createProcessorFromRequest(req){
  return {
    name: req.body.name,
    organization: req.body.organization,
    id: ControllerUtil.generateId(),
    created_at: new Date().toDateString()
  }
}
