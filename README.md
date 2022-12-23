# Amazon Biobank: A community-based genetic database
A blockchain-based genetic database that provides benefit-sharing

## Overview
Amazon Biobank combines blockchain and smart contract technologies to provide adequate benefit-sharing among all participants who collect, insert, process, store and validate genomic data. 

It also provides traceability and auditability, allowing easy association between biotechnological research and DNA data

![Amazon Biobank DNA details](https://user-images.githubusercontent.com/28439483/191982802-f53545ad-3094-486f-972a-e3aa013c5c55.png)

| Inserting DNA | Buying DNA | Auditing transaction on Blockchain |
|-------|---------|-------|
| ![inserting-dna](https://user-images.githubusercontent.com/28439483/191984389-24a5c96a-07a2-4063-a087-4e6b173a8a7d.png) | ![buy-dna-data](https://user-images.githubusercontent.com/28439483/191984861-0b1b139f-ebe0-4b2a-afb2-17462a27152f.png) | ![explorer_transaction_detail](https://user-images.githubusercontent.com/28439483/191983731-a57e07b1-4f70-4e9f-b658-8196a8c98900.png) |

## Install
* [Windows](https://github.com/amazon-biobank/biobank/releases/tag/v0.1.5)


## Resources
* [Project page](https://sites.usp.br/ubri/amazon-biobank-preserving-the-biodiversity-of-the-amazon-rainforest-with-blockchain/)
* XXI Brazilian Symposium on Information and Computational Systems Security (2021) - [Article](https://doi.org/10.5753/sbseg_estendido.2021.17342) and [Video](https://youtu.be/PqujKOURc44)


## About the performance of the system
Our software was designed to be highly scalable, by using as underlying consensus a lightweight RAFT protocol. (See [Wang 2020]( https://doi.org/10.1109/ICDCS47774.2020.00165))
*  Takes less than 1 second to add a new block
*  Can support a throughput of at least 200 transactions per second

In addition, DNA data is distributed using BitTorrent protocol. So, only BitTorrent magnet links are registered on the blockchain. (See [Torrente](https://doi.org/10.5753/sbseg_estendido.2021.17343))
* Size of a BitTorrent magnet link: 20 bytes
* Time to generate a magnet link from a 1 GB file: 18 seconds
* Time to download 1 GB using Torrente and micropayments (2MB/s network): 9 minutes
   - For reference: Time to download 1 GB in a conventional BitTorrent without micropayments (2MB/s network): 8.5 minutes

Below are preliminary numbers about some operations of the system. Note that it was measured using a remote private server, contacted via VPN rather than using the public Internet. Also, we used a Hyperledger Fabric test network, instead of a production-ready one.
* Time taken to read details about a DNA data: 367 millisecond
* Time taken to register a DNA on the system: 3.5 seconds
* Time taken to buy a DNA: 7.7 seconds (note that it requires 3 writing transactions to the blockchain)







