import mdb from 'mongodb';

import { mdbConnectionString } from '../config';

export default async function mongoClient() {
  const client = new mdb.MongoClient(mdbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const mdb = client.db();

    // Test the connection
    const collections = await mdb.collections();
    console.log(
      'Connected to MongoDB | Collections count:',
      collections.length
    );

    return {
      mdb,
      mdbClose: () => client.close(),
    };
  } catch (err) {
    console.error('Error in MongoDB Client', err);
    process.exit(1);
  }
}
