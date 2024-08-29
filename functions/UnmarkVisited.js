// This function is the endpoint's request handler.
exports = async function ({ query, headers, body }, response) {
  try {
    const mongodb = context.services.get("mongodb-atlas");
    const mvCollection = mongodb.db("nodeapp").collection("markVisited");
    const jsonData = JSON.parse(body.text());

    if (
      !jsonData ||
      !jsonData.userId ||
      !jsonData.id
    ) {
      return {
        error:
          "Missing required fields: title, description, attractions, createdBy",
        body,
        query,
        jsonData,
      };
    }

    const rex=await mvCollection.deleteOne({userId,id})
    return rex;
  } catch (e) {
    console.error("Error occurred while fetching attractions:", e);
    return { error: e.message };
  }
};
