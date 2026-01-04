
import app from './app.js';
import { DBServer, MongoDBAtlasDBServer } from './config/dbserver.js';

const { DATABASE, DATABASE_PASSWORD } = process.env;
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
const DB_TYPE = process.env.DB_TYPE || 'test';
const DB = (DB_TYPE == 'test') ? new DBServer() : new MongoDBAtlasDBServer(DATABASE, DATABASE_PASSWORD);
await DB.createServer()
const db = await DB.connect()
app.listen(EXPRESS_PORT, () => {
    console.log("done")
    console.log(`API server running on http://localhost:${EXPRESS_PORT}`);
});