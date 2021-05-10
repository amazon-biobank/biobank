'use strict';

const fs = require('fs-extra');
const yaml = require('js-yaml');
const URL = require('url');
const os = require('os');
const path = require('path');
const CONFIG = require('./config.json');

class SmartContractUtil {
    static async getConnectionProfile() {
        const homedir = os.homedir();
        const connectionProfilePath = path.join(homedir, CONFIG.connectionProfilePath);

        const connectionProfileContents = await fs.readFile(connectionProfilePath, 'utf8');
        if (connectionProfilePath.endsWith('.json')) {
            return JSON.parse(connectionProfileContents);
        } else if (connectionProfilePath.endsWith('.yaml') || connectionProfilePath.endsWith('.yml')) {
            return yaml.safeLoad(connectionProfileContents);
        }
    }

    static async submitTransaction(contractName, functionName, args, gateway) {
        const network = await gateway.getNetwork('channel2');
        let contract;
        if (contractName !== '') {
            contract = await network.getContract('currency', contractName);
        } else {
            contract = await network.getContract('currency');
        }
        const responseBuffer = await contract.submitTransaction(functionName, ...args);
        return responseBuffer;
    }

    static async evaluateTransaction(contractName, functionName, args, gateway) {
        const network = await gateway.getNetwork('channel2');
        let contract;
        if (contractName !== '') {
            contract = await network.getContract('currency', contractName);
        } else {
            contract = await network.getContract('currency');
        }
        const responseBuffer = await contract.evaluateTransaction(functionName, ...args);
        return responseBuffer;
    }

    static isLocalhostURL(url) {
        const parsedURL = URL.parse(url);
        const localhosts = [
            'localhost',
            '127.0.0.1'
        ];
        return localhosts.indexOf(parsedURL.hostname) !== -1;
    }

    static hasLocalhostURLs(connectionProfile) {
        const urls = [];
        for (const nodeType of ['orderers', 'peers', 'certificateAuthorities']) {
            if (!connectionProfile[nodeType]) {
                continue;
            }
            const nodes = connectionProfile[nodeType];
            for (const nodeName in nodes) {
                if (!nodes[nodeName].url) {
                    continue;
                }
                urls.push(nodes[nodeName].url);
            }
        }
        return urls.some((url) => this.isLocalhostURL(url));
    }
}

module.exports = SmartContractUtil;
