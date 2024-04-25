// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
    const mongodb = context.services.get("mongodb-atlas");
    const tripCollection = mongodb.db("nodeapp").collection("trips");
    try {
      if (!body || !body.peopleCount || !body.pickupPoint || !body.dropPoint || !body.placesToVisit) {
            return { error: "Missing required fields: peoplecount, pickupPoint, dropPoint, placesToVisit" };
      }
      const newItem = {
        ...body
      };
      return tripCollection.insertOne(newItem)
        .then(result => {return result})
        .catch(err => {return err̥})
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.message };
    }
};
