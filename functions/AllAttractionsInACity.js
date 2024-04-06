// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
  
    const doc = context.services.get("mongodb-atlas").db("nodeapp").collection("places");
    const doc_tg = context.services.get("mongodb-atlas").db("nodeapp").collection("touristguides")
    const cityName = query.cityName;

    try {
        let allAttractionsInACity = await doc.find({placeCity:cityName},{ placeName:1, placeImage:1 })
            .sort({ placeName: 1 })
            .toArray();
        let allTouristGuidesInACity = await doc_tg.find({city:cityName},{ image:1, name:1,languages:1,charge:1 })
            .sort({ chargedByRS: 1 })
            .toArray();
        
        return {allAttractionsInACity,allTouristGuidesInACity};
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.message };
    }
};