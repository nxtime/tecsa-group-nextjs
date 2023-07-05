import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.NEXT_PUBLIC_MONGO_URI ?? "";
const options: MongoClientOptions = {

};

if (!process.env.NEXT_PUBLIC_MONGO_URI) {
  throw new Error("Should add MONGO_URI to environment variable");
}

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;