// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
  
    const doc = context.services.get("mongodb-atlas").db("nodeapp").collection("quickattractions");
    //const M = require("mongoose")

    try {
        let quickAttractions = await doc.find({ enabled: true })
            .sort({ createdAt: 1 })
            .toArray();

        // Extracting attraction IDs
        let attractionIds = quickAttractions.map(attraction => attraction.attractions);

        // Fetching attractions based on IDs
        const attractionsCollection = context.services.get("mongodb-atlas").db("nodeapp").collection("places");
        let attractions = await attractionsCollection.find({ _id: { $in: attractionIds } },{ placeName: 1, placeCity: 1, placeImage: 1, placeAliasImage: 1, _id: 0 })
            .toArray();

        // Mapping attractions to quickAttractions
        quickAttractions = quickAttractions.map(attraction => {
            attraction.attractions = attractions.filter(a => a._id === attraction.attractions);
            return attraction;
        });

        return quickAttractions;
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.message };
    }
};