// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
    
    try {
      const mongodb = context.services.get("mongodb-atlas");
      const tripCollection = mongodb.db("nodeapp").collection("trips");
      console.log("Body:", body);
      //return {data:body.text()};
      // const encodedData = body.Data;
      // console.log("Encoded data:", encodedData); // Add this line for loggingf
      // const decodedData = Buffer.from(encodedData, 'base64').toString('utf-8');
      // const jsonData = JSON.parse(decodedData);
      
      // if (!jsonData || !jsonData.peopleCount || !jsonData.pickupPoint || !jsonData.dropPoint || !jsonData.placesToVisit) {
      //       return { error: "Missing required fields: peopleCount, pickupPoint, dropPoint, placesToVisit",body,query,jsonData };
      // }
      return tripCollection.insertOne(JSON.parse(body.text()))
        .then(result => {return result})
        .catch(err => {return err})
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.message };
    }
};
