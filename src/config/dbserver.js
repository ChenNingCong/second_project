import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { createProducts } from './fixture.js';

/**
 * @abstract
 * Base class for Database Servers
 */
class DBServer {
    constructor() {
        if (this.constructor === DBServer) {
            throw new Error("Abstract class 'DBServer' cannot be instantiated directly.");
        }
        /** @type {string} */
        this.uri = "";
        /** @type {MongoMemoryServer | null} */
        this.server = null;
        /** @type {mongoose.Connection | null} */
        this.connection = null
    }

    /**
     * Initializes the server and sets the URI.
     * @abstract
     * @returns {Promise<void>}
     */
    async createServer() {
        throw new Error("Method 'createServer()' must be implemented.");
    }

    /**
     * Connects to the database and performs initial setup.
     * @returns {Promise<import('mongoose').Connection>}
     */
    async connect() {
        if (!this.uri && this.constructor.name !== 'InMemoryDB') {
            throw new Error("Database URI is missing. Did you call createServer()?");
        }

        const connection = (await mongoose.connect(this.uri)).connection;
        this.connection = connection
        return connection;
    }

    /**
     * Disconnects from the database and stops the local server if it exists.
     * @returns {Promise<void>}
     */
    async disconnect() {
        await mongoose.disconnect();
        if (this.server) {
            await this.server.stop();
        }
    }
    /**
     * @abstract
     * Method to seed the database with initial data.
     * Only use for testing and controlled by POPULATE_TEST_DATA
     * @returns {Promise<void>}
     */
    async populateTestData() {
        if (!this.connection) {
            throw new Error("Connection is null. Did you call createServer()?");
        }
        // remove everything
        this.connection.db.dropDatabase()
        await createProducts()
    }
}

/**
 * In-memory database implementation for testing.
 * @extends {DBServer}
 */
class InMemoryDB extends DBServer {
    async createServer() {
        this.server = await MongoMemoryServer.create();
        this.uri = this.server.getUri();
    }
}

/**
 * Production-ready MongoDB Atlas implementation.
 * @extends {DBServer}
 */
class MongoDBAtlasDBServer extends DBServer {
    /**
     * @param {string} base_url - The Atlas connection string.
     * @param {string} password - The database user password.
     */
    constructor(base_url, password) {
        super();
        this.uri = base_url.replace('<PASSWORD>', password);
    }

    /** @override */
    async createServer() {
        // No virtual server creation needed for Atlas
        return Promise.resolve();
    }
}

export { DBServer, InMemoryDB, MongoDBAtlasDBServer };
