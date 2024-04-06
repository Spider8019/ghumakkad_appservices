// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
  
    const doc = context.services.get("mongodb-atlas").db("nodeapp").collection("places");
    const limit = parseInt(query.limit) || 10;

    try {
        let topSearchedAttractions = await doc.find({})
            .sort({ placeVisit: -1 }) // Sort by placeVisit in descending order
            .limit(limit)
            .toArray();
        
        return topSearchedAttractions;
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: "An error occurred while fetching top searched attractions." };
    }
};
