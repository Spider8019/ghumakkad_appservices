// This function is the endpoint's request handler.
exports = async function ({ query, headers, body }, response) {
  try {
    const mongodb = context.services.get("mongodb-atlas");
    const mvCollection = mongodb.db("nodeapp").collection("markVisited");
    return body;
    
  } catch (e) {
    console.error("Error occurred while fetching attractions:", e);
    return { error: e.message };
  }
};
