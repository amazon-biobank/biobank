const InsertCertificateService = require('./../services/insertCertificateService')

exports.new = async function(req, res, next){
  res.render('session/new', { });
};

exports.create = async function(req, res, next){
  insertCertificateService = new InsertCertificateService()
  await insertCertificateService.insertCertificate(req)
  res.redirect("/")
};

exports.destroy = async function(req, res, next){
  await new InsertCertificateService().destroyCertificate()
  res.redirect("/session/new")
};



