
import createApp from './app.js';
import { DBServer, InMemoryDB, MongoDBAtlasDBServer } from './config/dbserver.js';
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
const DB_TYPE = process.env.DB_TYPE || 'memory';
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
if (POPULATE_TEST_DATA) {
    await DB.populateTestData()
}
const app = createApp()
app.listen(EXPRESS_PORT, () => {
    console.log("done")
    console.log(`API server running on http://localhost:${EXPRESS_PORT}`);
});

