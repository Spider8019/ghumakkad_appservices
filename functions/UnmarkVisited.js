// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
    
    try {
      const mongodb = context.services.get("mongodb-atlas");
      const mvCollection = mongodb.db("nodeapp").collection("markVisited");
      const jsonData=JSON.parse(body.text())
      console.log(jsonData)
      if (!jsonData || !jsonData.userId || !jsonData.id ) {
            return { error: "Missing required fields:" };
      }
      return mvCollection.deleteOne(jsonData)
        .then(result => {return result})
        .catch(err => {return err})
    } catch (e) {
        console.error("Error occurred while deleting marking", e);
        return { error: e.message };
    }
};
