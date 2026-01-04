import { DBServer, InMemoryDB, MongoDBAtlasDBServer } from "../../src/config/dbserver.js";

export async function createDB(options = {}) {
    const { 
        DATABASE, 
        DATABASE_PASSWORD, 
        DB_TYPE = 'memory', 
        POPULATE_TEST_DATA = false 
    } = options;

    /** @type {DBServer} */
    const DB = (DB_TYPE === 'memory') 
        ? new InMemoryDB() 
        : new MongoDBAtlasDBServer(DATABASE, DATABASE_PASSWORD);

    await DB.createServer();
    await DB.connect();

    if (POPULATE_TEST_DATA === true || POPULATE_TEST_DATA === 'true') {
        await DB.populateTestData();
    }

    return DB;
}