/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const userName = process.argv[2]
const context = process.argv[3]
var caURL



async function main() {
    try {
        // load the network configuration
        if(context == 'microfabric'){
            const ccpPath = path.resolve(__dirname, '..', 'fabric-details', 'connection.json');
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
            caURL = ccp.certificateAuthorities['org1ca-api.127-0-0-1.nip.io:8080'].url;
        } 
        else if(context == 'remote') {
            // const ccpPath = path.resolve(__dirname, '..', '..', 'blockchain', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccpPath = path.resolve(__dirname, '../../../fabric-multihost/setup3/machines/vm1/api-2.0/config/connection-org1.json');
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
            caURL = ccp.certificateAuthorities['ca.org1.amazonbiobank.mooo.com'].url;
        }
        

        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(userName);
        if (userIdentity) {
            console.log(`An identity for the user ` + userName + ` already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: userName,
            role: 'client'
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: userName,
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put(userName, x509Identity);
        console.log(`Successfully registered and enrolled admin user ` + userName + ` and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to register user` + userName + `: ${error}`);
        process.exit(1);
    }
}

main();
