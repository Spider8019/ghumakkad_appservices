// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
  
    const doc = context.services.get("mongodb-atlas").db("nodeapp").collection("places");
    const {placeName} = query;
    console.log(placeName)

    try {
        let possibleAttractions = await doc.find({
              $or: [
                { "placeLocation.text": { $regex: placeName, $options: "i" } }, // Case-insensitive matching
                { placeName: { $regex: placeName, $options: "i" } },
                ]
            })
            .sort({ placeName: 1 })
            .toArray();
            console.log(possibleAttractions)
        
        return possibleAttractions;
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.meesage };
    }
};