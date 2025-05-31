export async function findBinsBySku(db, sku) {
    const collection = await db.collection("Bins");
    let query = { sku: sku };

    let results = await collection.find(query).toArray();

    // display lowest quantity bins first to prioritise emptying those
    results.sort((a, b) => a.quantity - b.quantity);

    return results;
}

/*
When given an SKU, return a list of bins that we might want to put that item in
*/
export async function recommendBins(db, sku) {
    const candidateBins = await findBinsBySku(db, sku);
    const bins = await emptyBins(db);

    candidateBins.push(bins);

    return candidateBins;

}

/*
Finds all empty bins
*/
export async function emptyBins(db, onlyReturnOne = false) {
    const collection = await db.collection("Bins");
    let query = { quantity: 0 };
    let results = await collection.find(query).toArray();

    if (!results) {
        // no bins are empty
        return;
    } else if (!onlyReturnOne) {
        // return all empty bins
        return results;
    } else {
        // return one empty bin
        return results[0];
    }
}