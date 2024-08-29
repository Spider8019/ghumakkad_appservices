// This function is the endpoint's request handler.
exports = async function ({ query, headers, body }, response) {
  try {
    const mongodb = context.services.get("mongodb-atlas");
    const qaCollection = mongodb.db("nodeapp").collection("markVisited");
    // return body;
    // const jsonData = JSON.parse(body.text());
    const jsonData=body

    if (
      !jsonData ||
      !jsonData.id ||
      !jsonData.userId
    ) {
      return {
        error:
          "Missing required fields: title, description, attractions, createdBy",
        body,
        query,
        jsonData,
      };
    }

    let rex=await qaCollection.deleteOne({userId:jsonData.userId,id:jsonData.id})
    return rex
  } catch (e) {
    console.error("Error occurred while fetching attractions:", e);
    return { error: e.message };
  }
};
