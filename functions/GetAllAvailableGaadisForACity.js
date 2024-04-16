// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
    const doc = context.services.get("mongodb-atlas").db("nodeapp").collection("rentalgaadis");
    let cityName = query.cityName;
    let model=query.model
    
    try {
        let allAvailableGaadisForACity = await doc.find({ cityName,model }).sort({ priority: 1 })
            .toArray();
        return allAvailableGaadisForACity;
    } catch (e) {
        console.error("Error occurred while fetching allAvailableGaadisForACity:", e);
        return { error: e.message };
    }
};
