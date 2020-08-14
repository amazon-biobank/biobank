# Biobank

## Initial concepts
It is advisable to do at least some Hyperledger Fabric tutorials, especially [Using the Fabric test network](https://hyperledger-fabric.readthedocs.io/en/release-2.2/test_network.html), [Deploying a smart contract to a channel](https://hyperledger-fabric.readthedocs.io/en/release-2.2/deploy_chaincode.html), and [Writing your First Application](https://hyperledger-fabric.readthedocs.io/en/release-2.2/write_first_app.html).

Maybe you can find helpful to read the [Key Concepts](https://hyperledger-fabric.readthedocs.io/en/release-2.2/key_concepts.html) section

## Project
This is the final project in the course of computer engineer, of University of São Paulo.

[Trello board](https://trello.com/b/lbII1kRk/amazonas-40)

Get the dev version in https://github.com/leonardotkimura/biobank-dev


## How to use
### Setting up 
1. Clone the repository
2. Install the [Fabric binaries](https://hyperledger-fabric.readthedocs.io/en/release-2.2/install.html) (I'm not sure if it is absolutely needed)
3. Set up the environment variables `export PATH=<path to repository location>/bin:$PATH`
4. Install Docker and Docker Compose

### Deploying a smart contract
1. Write your smart contract in contract/lib/
2. go to test-network/
3. Set up a network and a channel, with `./network.sh up createChannel`
4. Use the `./deploy_chaincode.sh` script to deploy your smart contract <br>
4.1 Make shure you set up the parameters `CHAINCODE_NAME`, and `SEQUENCE`

### Testing a smart contract
There is some invocations command template's in the sucess_commands file. You can set you parameters and use them to test the chaincode

ps: Dont forget updating your environment variable (set to peer 1)

### Monitor network
You can monitor you network by command `./monitordocker.sh net_test`
