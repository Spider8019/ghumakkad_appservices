// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
  
    const doc = context.services.get("mongodb-atlas").db("nodeapp").collection("places");
    const {placeName} = query;
    let regex = new RegExp(placeName, 'i');
    try {
        let possibleAttractions = await doc.find({
              $or: [{ placeName: regex }, { placeCity: regex }]
            })
            .sort({ placeName: 1 })
            .toArray();
        
        return possibleAttractions;
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.meesage };
    }
};