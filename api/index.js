var express = require('express');
const path = require('path');
const fs = require('fs');
var app = express();


app.get('/connection-profile', function(req, res){
  const connectionProfilePath = path.resolve(__dirname, '..',  'blockchain', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
  // const connectionProfilePath = path.resolve(__dirname, '../../fabric-multihost/setup3/machines/vm1/api-2.0/config/connection-org1.json');
  const connectionProfile = fs.readFileSync(connectionProfilePath)
  res.setHeader('Content-Type', 'application/json');
  res.end(connectionProfile);
});

app.get('/admin-id', function(req, res){
  const connectionProfilePath = path.resolve(__dirname, '..',  'application', 'fabric-details', 'wallet', 'admin.id');
  const connectionProfile = fs.readFileSync(connectionProfilePath)
  res.setHeader('Content-Type', 'application/json');
  res.end(connectionProfile);
});

var server = app.listen( process.env.PORT || 3003, function(){
  console.log('Biobank API listening on port ' + server.address().port);
});
