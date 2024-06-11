// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
    
    try {
      const mongodb = context.services.get("mongodb-atlas");
      const qaCollection = mongodb.db("nodeapp").collection("quickattractions");
      const jsonData=JSON.parse(body.text())
      const ObjectId = mongodb.ObjectId;
      
      if (!jsonData || !jsonData.labelForTitle || !jsonData.title || !jsonData.attractions || !jsonData.createdBy) {
            return { error: "Missing required fields: title, description, attractions, createdBy",body,query,jsonData };
      }
      // Convert hex strings in attractions to ObjectId
      jsonData.attractions = jsonData.attractions.map(attraction => new ObjectId(attraction));
      
      return qaCollection.insertOne(jsonData)
        .then(result => {return {...result,...jsonData,objectID:mongodb.ObjectId}})
        .catch(err => {return {...err,...jsonData,error:err.message}})
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.message };
    }
};
