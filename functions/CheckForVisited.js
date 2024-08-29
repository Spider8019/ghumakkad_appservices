// This function is the endpoint's request handler.
exports = async function ({ query, headers, body }, response) {
  const doc = context.services
    .get("mongodb-atlas")
    .db("nodeapp")
    .collection("markVisited");
  
  try {
    let userId = query.userId;
    let id = query.id;
    let returnIfExisted = await doc.findOne({ userId, id });
    if (returnIfExisted == null) return { existing: false };
    return { ...returnIfExisted, existing: true };
  } catch (e) {
    console.error("Error occurred while fetching attractions:", e);
    return { error: e.message };
  }
};
