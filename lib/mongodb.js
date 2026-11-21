import dns from "node:dns";
import { MongoClient } from "mongodb";


if (!process.env.VERCEL) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables");
}


const globalForMongo = globalThis;
if (!globalForMongo._wedplanMongoClient) {
  globalForMongo._wedplanMongoClient = new MongoClient(uri);
}

export const client = globalForMongo._wedplanMongoClient;
export const db = client.db(process.env.DB_NAME || "wedplan");