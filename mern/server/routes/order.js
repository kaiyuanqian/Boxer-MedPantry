import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

import '@shopify/shopify-api/adapters/node';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: ['orders'],
    hostName: 'http://localhost:5050',
    apiVersion: LATEST_API_VERSION,
});

const client = new shopify.clients.Rest({
    session: {
      accessToken: process.env.SHOPIFY_ADMIN_KEY,
      shop: 'boxer-test.myshopify.com',
    },
  });

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the orders.
router.get("/", async (req, res) => {
    const results = await client.get({ path: 'orders' });
    res.send(results).status(200);

});

export default router;