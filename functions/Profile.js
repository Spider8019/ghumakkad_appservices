// This function is the endpoint's request handler.
exports = async function ({ query, headers, body }, response) {
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
    let totalAttractions = await PLACES_COLLECTION.count();

    let groupByVisitCounts = await MV_COLLECTION.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray();
    let index = groupByVisitCounts.findIndex(user => user._id === userId);
    let topTravellers = `Congratulations!! You are in top ${
      ((index+1) / groupByVisitCounts.length)*100
    }% of travellers of ghumakkad`;

    return { totalPlacesVisited:groupByVisitCounts[index].count.toString(), totalAttractions:totalAttractions.toString(), topTravellers };
  } catch (e) {
    console.error("Error occurred while fetching attractions:", e);
    return { error: e.message };
  }
};
