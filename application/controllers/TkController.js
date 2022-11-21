const ControllerUtil = require('./ControllerUtil.js');
const DataService = require('./../services/dataService')

  exports.newTkData = async function(req,res,next){
    res.render('data/tradicional-knowledge-new', {  });
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
  