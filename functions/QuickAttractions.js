// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
  
    const doc = context.services.get("mongodb-atlas").db("nodeapp").collection("quickattractions");
    const doc_attractions= context.services.get("mongodb-atlas").db("nodeapp").collection("places");
    //const M = require("mongoose")

    try {
        let quickAttractions = await doc.find({ enabled: true })
            .sort({ createdAt: 1 })
            .toArray();
            
        quickAttractions=quickAttractions.map(async(attraction) => {
  
             attraction.attractions=attraction.attractions.map(async(attraction_id)=>{
               let detailed_attraction = await doc_attractions.findOne({ _id: attraction_id },{ placeName: 1, placeCity: 1, placeImage: 1, placeAliasImage: 1 });
               return detailed_attraction;
             })
             
            // console.log(detailed_attraction)
            return attraction;
        })

        return quickAttractions;
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.message };
    }
};