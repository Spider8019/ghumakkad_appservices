// This function is the endpoint's request handler.
exports = function ({ query, headers, body }, response) {
  const PLACES_COLLECTION = context.services
    .get("mongodb-atlas")
    .db("nodeapp")
    .collection("places");
  const MV_COLLECTION = context.services
    .get("mongodb-atlas")
    .db("nodeapp")
    .collection("markVisited");
  let userId = query.userId;
  try {
    let totalPlacesVisited = doc.MV_COLLECTION.countDocuments(
      { userId }
    );
    let totalAttractions = doc.PLACES_COLLECTION.countDocuments()
    return {totalPlacesVisited,totalAttractions};
  } catch (e) {
    console.error("Error occurred while fetching attractions:", e);
    return { error: e.message };
  }
};
