
import createApp from './app.js';
import { DBServer, InMemoryDB, MongoDBAtlasDBServer } from './config/dbserver.js';
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
const DB_TYPE = process.env.DB_TYPE || 'memory';
const INIT_ONLY = process.env.INIT_ONLY && process.env.INIT_ONLY == 'true'
/** @type {DBServer} */
let DB;
if (DB_TYPE == "atlas") {
    const { DATABASE, DATABASE_PASSWORD } = process.env;
    DB = new MongoDBAtlasDBServer(DATABASE, DATABASE_PASSWORD)
} else if (DB_TYPE == "memory") {
    DB = new InMemoryDB()
}
const POPULATE_TEST_DATA = process.env.POPULATE_TEST_DATA == 'true';
await DB.createServer()
await DB.connect()
if (POPULATE_TEST_DATA || INIT_ONLY) {
    await DB.populateTestData()
}
if (!INIT_ONLY) {
    const app = createApp()
    app.listen(EXPRESS_PORT, () => {
        console.log(`API server running on http://localhost:${EXPRESS_PORT}`);
    });
} else {
    console.log("Finish initializing the database")
    await DB.disconnect()
}



