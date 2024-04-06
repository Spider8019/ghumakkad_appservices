// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
    const doc = context.services.get("mongodb-atlas").db("nodeapp").collection("places");
    let placeName = query.placeName;
    
    try {
        let attractionInACity = await doc.findOneAndUpdate(
            { placeName: placeName },
            { $inc: { placeVisit: 1 } }, // Increment placeVisit by 1
            { returnDocument: 'after' } // Return the updated document
        );
        return attractionInACity;
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.message };
    }
};
