// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
    const doc = context.services.get("mongodb-atlas").db("nodeapp").collection("places");
    
    try {
        let recentlyInsertedAttractions = await doc.find({}, { placeName: 1, placeImage: 1, placeCity: 1 })
            .sort({ createdAt: -1 })
            .limit(10)
            .toArray();
        
        return recentlyInsertedAttractions;
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: "An error occurred while fetching attractions." };
    }
};
