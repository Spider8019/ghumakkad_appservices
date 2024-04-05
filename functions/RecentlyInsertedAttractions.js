// This function is the endpoint's request handler.
exports = function({ query, headers, body}, response) {

    const doc=context.services.get("mongodb-atlas").db("nodeapp").collection("places")
    let recentlyInsertedAttractions=doc.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      
    return  recentlyInsertedAttractions;
};
