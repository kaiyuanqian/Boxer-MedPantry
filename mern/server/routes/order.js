import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

import '@shopify/shopify-api/adapters/node';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import { restResources } from '@shopify/shopify-api/rest/admin/2025-04';

import { getCleanedOrders, getRequiredBins } from "../controllers/orderController.js";

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: ['orders'],
    hostName: 'http://localhost:5050',
    apiVersion: LATEST_API_VERSION,
    restResources,
});

const session = {
    accessToken: process.env.SHOPIFY_ADMIN_KEY,
    shop: 'boxer-test.myshopify.com',
  }

const client = new shopify.clients.Rest({
    session: session,
});

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the orders, with cleaned information.
router.get("/", async (req, res) => {
    const results = await getCleanedOrders(client);

    if (!results) res.send("Orders not found").status(404);
    res.send(results);

});


// get a list of the required bins based on order id
router.get("/requiredBins/:orderId", async (req, res) => {
    const results = await getRequiredBins(shopify, session, req.params.orderId);

    if (!results) res.send("Order not found").status(404);
    res.send(results);
});


// taking an order will close the order in Shopify, preventing it from showing up in the list of orders

// if the order taking fails/is cancelled, the closed order is re-opened

export default router;