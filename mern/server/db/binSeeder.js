import { MongoClient, ServerApiVersion } from "mongodb";
//import dotenv from "dotenv";

const URI = process.env.ATLAS_URI;
const dbName = "MedPantry";       // replace with your DB name

export async function seedBinsIfEmpty() {
  const client = new MongoClient(URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    const binsCollection = db.collection("Bins");

    const count = await binsCollection.countDocuments();

    if (count > 0) {
      console.log(`Bins collection already has ${count} documents. Seeding skipped.`);
      return;
    }

    const bins = [];

    for (let i = 1; i <= 800; i++) {
      bins.push({
        _id: `${String(i)}`,
        sku: null,
        itemName: null,
        quantity: 0,
      });
    }

    const result = await binsCollection.insertMany(bins);
    console.log(`Inserted ${result.insertedCount} bins!`);
  } catch (err) {
    console.error("Error seeding bins:", err);
  } finally {
    await client.close();
  }
}