export async function findBinsBySku(db, sku) {
    const collection = await db.collection("Bins");
    let query = { sku: sku };

    let results = await collection.find(query).toArray();

    // display lowest quantity bins first to prioritise emptying those
    results.sort((a, b) => a.quantity - b.quantity);

    return results;
}