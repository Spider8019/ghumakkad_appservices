// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
    
    try {
      const mongodb = context.services.get("mongodb-atlas");
      const qaCollection = mongodb.db("nodeapp").collection("quickAttractions");
      const jsonData=JSON.parse(body.text())
      
      if (!jsonData || !jsonData.labelForTitle || !jsonData.title || !jsonData.attractions || !jsonData.createdBy) {
            return { error: "Missing required fields: title, description, attractions, createdBy",body,query,jsonData };
      }
      return qaCollection.insertOne(jsonData)
        .then(result => {return result})
        .catch(err => {return err})
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.message };
    }
};
