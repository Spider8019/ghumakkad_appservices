// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
  
    const doc = context.services.get("mongodb-atlas").db("nodeapp").collection("places");
    const cityName = query.cityName;

    try {
        let allAttractionsInACity = await doc.find({placeCity:cityName},{ placeName:1, placeImage:1 })
            .sort({ placeName: 1 })
            .toArray();
        
        return allAttractionsInACity;
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.message };
    }
};