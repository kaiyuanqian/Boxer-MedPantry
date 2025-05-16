import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the bins.
router.get("/", async (req, res) => {
    let collection = await db.collection("Bins");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

// This section will help you get a single bin by id
router.get("/id/:id", async (req, res) => {
    let collection = await db.collection("Bins");
    // let query = { _id: new ObjectId(req.params.id) };
    let query = { _id: req.params.id };
    let result = await collection.findOne(query);
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// Find all bins containing an SKU
// return an array of bin ids
router.get("/sku/:sku", async (req, res) => {
    let collection = await db.collection("Bins");
    let query = { sku: req.params.sku };

    let results = await collection.find(query).toArray();

    if (!results) res.send("Bins not found").status(404);
    else res.send(results).status(200);
});

// This section will help you create a new bin.
router.post("/", async (req, res) => {
    try {
      let newDocument = {
        _id: req.body.id,
        sku: req.body.sku,
        itemName: req.body.itemName,
        quantity: req.body.quantity,
      };
      let collection = await db.collection("Bins");
      let result = await collection.insertOne(newDocument);
      res.send(result).status(204);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding bin");
    }
});

export default router;