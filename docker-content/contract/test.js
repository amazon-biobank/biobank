function uploadRawData(ctx, {url, description, collector, owners, price, conditions}) {
  console.info('============= START : Upload Raw Data ===========');
  const data = {
      docType: 'raw_data',
      url,
      description,
      collector,
      owners,
      price,
      conditions
  };
  console.info(data);
  console.info('============= END : Upload Raw Data ===========');
}

uploadRawData({}, {url: "teste.com", description: "descrição stststs", collector:"euzinho", owners:["eu"], price: 322, conditions: "essas condições"})