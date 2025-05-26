// This will help us connect to the database
import db from "../db/connection.js";

import { findBinsBySku } from "./binController.js";

export async function getCleanedOrders(client) {
    const results = await client.get({ path: 'orders' });
    const ordersNode = results.body.orders;

    const cleanedOrders = [];

    for (const order of ordersNode) {

        const cleanedOrder = {};
        cleanedOrder.id = order.id;
        cleanedOrder.name = order.name;

        const lineItemsNode = order.line_items;
        const cleanedLineItems = [];

        for (const lineItem of lineItemsNode) {
            const cleanedLineItem = {};
            cleanedLineItem.name = lineItem.name;
            cleanedLineItem.sku = lineItem.sku;
            cleanedLineItem.quantity = lineItem.quantity;
            cleanedLineItems.push(cleanedLineItem);
        }
        
        cleanedOrder.line_items = cleanedLineItems;
        cleanedOrders.push(cleanedOrder);
    }

    return cleanedOrders;
}

/*
Get a list of every bin that the volunteer should get items from, based on a given order ID
*/
export async function getRequiredBins(shopify, session, orderId) {
    const results = await shopify.rest.Order.find({
        session: session,
        id: orderId,
        fields: "id,name,line_items"
    });

    const requiredBins = [];

    const lineItems = results.line_items;
    for (const lineItem of lineItems) {
        const availableBins = await findBinsBySku(db, lineItem.sku);

        const targetQuantity = lineItem.quantity;

        let current = 0;

        for (const availableBin of availableBins) {
            current += availableBin.quantity;
            requiredBins.push(availableBin);
            if (current >= targetQuantity) {
                current = 0;
                break;
            }
        }
    }

    return requiredBins;
}