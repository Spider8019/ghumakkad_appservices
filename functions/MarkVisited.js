// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
    
    try {
      const mongodb = context.services.get("mongodb-atlas");
      const mvCollection = mongodb.db("nodeapp").collection("markVisited");
      const jsonData=JSON.parse(body.text())
      console.log(jsonData)
      if (!jsonData || !jsonData.id || !jsonData.averageTime || !jsonData.expenses || !jsonData.monthsInWhichYouVisit || !jsonData.rating || !jsonData.feedback) {
            return { error: "Missing required fields: id, averagePrice, expenses, monthsInWhichYouVisit, rating, feedback",body,query,jsonData };
      }
      return mvCollection.insertOne(jsonData)
        .then(result => {return result})
        .catch(err => {return err})
    } catch (e) {
        console.error("Error occurred while POSTING ATTRACTION:", e);
        return { error: e.message };
    }
};
