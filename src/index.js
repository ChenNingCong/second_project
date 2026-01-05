
import createApp from './app.js';
import app from './app.js';
import { DBServer, InMemoryDB, MongoDBAtlasDBServer } from './config/dbserver.js';
const app = createApp()
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;

const { DATABASE, DATABASE_PASSWORD } = process.env;
const DB_TYPE = process.env.DB_TYPE || 'memory';
const POPULATE_TEST_DATA = process.env.POPULATE_TEST_DATA == 'true';
/** @type {DBServer} */
const DB = (DB_TYPE == 'memory') ? new InMemoryDB() : new MongoDBAtlasDBServer(DATABASE, DATABASE_PASSWORD);
await DB.createServer()
const db = await DB.connect()
if (POPULATE_TEST_DATA) {
    await DB.populateTestData()
}
app.listen(EXPRESS_PORT, () => {
    console.log("done")
    console.log(`API server running on http://localhost:${EXPRESS_PORT}`);
});

