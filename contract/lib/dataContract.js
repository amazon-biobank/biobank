/*
 *
 * SPDX-License-Identifier: Apache-2.0
 */


'use strict';

const { Contract } = require('fabric-contract-api');

class DataContract extends Contract {

    async dataExists(ctx, dataId) {
        const buffer = await ctx.stub.getState(dataId);
        return (!!buffer && buffer.length > 0);
    }

    async uploadRawData(ctx, dataId, dataAttributes) {
        const {
            url, description, collector, owners, price, conditions
        } = JSON.parse(dataAttributes);

        const exists = await this.dataExists(ctx, dataId);
        if (exists) {
            throw new Error(`The data ${dataId} already exists`);
        }

        const data = {
            url,
            description,
            collector,
            owners,
            price,
            conditions,
            docType: 'raw_data',
        };
        const buffer = Buffer.from(JSON.stringify(data));
        await ctx.stub.putState(dataId, buffer);
    }

    async uploadProcessedData(ctx, dataId, dataAttributes) {
        const {
            url, description, collector, processor, owners, price, conditions
        } = JSON.parse(dataAttributes);

        const exists = await this.dataExists(ctx, dataId);
        if (exists) {
            throw new Error(`The data ${dataId} already exists`);
        }
        
        const data = {
            url,
            description,
            collector,
            processor,
            owners,
            price,
            conditions,
            docType: 'processed_data',
        };
        const buffer = Buffer.from(JSON.stringify(data));
        await ctx.stub.putState(dataId, buffer);
    }

    async readData(ctx, dataId) {
        const exists = await this.dataExists(ctx, dataId);
        if (!exists) {
            throw new Error(`The data ${dataId} does not exist`);
        }
        const buffer = await ctx.stub.getState(dataId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateData(ctx, dataId, dataAttributes) {
        const {
            url, description, collector, processor, owners, price, conditions, docType
        } = JSON.parse(dataAttributes);

        const exists = await this.dataExists(ctx, dataId);
        if (!exists) {
            throw new Error(`The data ${dataId} does not exist`);
        }
        const data = {
            url,
            description,
            collector,
            processor,
            owners,
            price,
            conditions,
            docType
        };
        const buffer = Buffer.from(JSON.stringify(data));
        await ctx.stub.putState(dataId, buffer);
    }

    async deleteData(ctx, dataId) {
        const exists = await this.dataExists(ctx, dataId);
        if (!exists) {
            throw new Error(`The data ${dataId} does not exist`);
        }
        await ctx.stub.deleteState(dataId);
    }

}

module.exports = DataContract;
