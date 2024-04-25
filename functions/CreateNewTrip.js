// This function is the endpoint's request handler.
exports = function({ query, headers, body}, response) {
    
    try {
      const mongodb = context.services.get("mongodb-atlas");
      
      const tripCollection = mongodb.db("nodeapp").collection("trips");
      return JSON.parse(body)
      console.log()
      const decodedData = Buffer.from(JSON.parse(body).Data, 'base64').toString('utf-8');
      const jsonData = JSON.parse(decodedData);
      
      if (!jsonData || !jsonData.peopleCount || !jsonData.pickupPoint || !jsonData.dropPoint || !jsonData.placesToVisit) {
            return { error: "Missing required fields: peopleCount, pickupPoint, dropPoint, placesToVisit",body,query,jsonData };
      }
      return tripCollection.insertOne(jsonData)
        .then(result => {return result})
        .catch(err => {return err̥})
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.message };
    }
};
