// This function is the endpoint's request handler.
exports = function({ query, headers, body}, response) {
    
    try {
      const mongodb = context.services.get("mongodb-atlas");
      const tripCollection = mongodb.db("nodeapp").collection("trips");
      if (!body || !body.peopleCount || !body.pickupPoint || !body.dropPoint || !body.placesToVisit) {
            return { error: "Missing required fields: peopleCount, pickupPoint, dropPoint, placesToVisit",body,query };
      }
      return tripCollection.insertOne(body)
        .then(result => {return result})
        .catch(err => {return err̥})
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.message };
    }
};
