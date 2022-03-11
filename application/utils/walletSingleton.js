const { Gateway, Wallets, Wallet } = require('fabric-network');


class WalletSingleton {
  async getWallet(){
    if(!WalletSingleton.instance){
      WalletSingleton.instance = await Wallets.newInMemoryWallet()
    }
    return WalletSingleton.instance
  }
}

module.exports = WalletSingleton;
