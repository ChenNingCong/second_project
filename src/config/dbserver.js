import { MongoMemoryServer } from 'mongodb-memory-server';
import { createProducts } from './fixture.js';
import * as mongoose from 'mongoose';
class DBServer {
    async createServer() {
        this.server = await MongoMemoryServer.create();
        // for in memory db we use uri of the memory server
        this.uri = this.server.getUri();
    }
    async connect() {
        const connection =  (await mongoose.connect(this.uri)).connection
        await createProducts()
        return connection
    }
    async disconnect() {
        await mongoose.disconnect();
        return await this.server.stop();
    }
}
class MongoDBAtlasDBServer extends DBServer {
    constructor(base_url, password) {
        this.uri = base_url.replace('<PASSWORD>', password);
    }
    async createServer() {}   
}
export {DBServer, MongoDBAtlasDBServer};