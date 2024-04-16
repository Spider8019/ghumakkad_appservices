// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
    const doc = context.services.get("mongodb-atlas").db("nodeapp").collection("rentalgaadis");
    let cityName = query.cityName;
    let model=query.model
    
    try {
        let availableGaadis = await doc.find({ cities:{$in:[cityName]},gaadiModel:model }).sort({ priority: 1 })
            .toArray();
        let gaadiUrl="";
        const jsondata= await context.functions.execute("FetchInfoFromLink","https://raw.githubusercontent.com/Spider8019/json_config/master/gaadi.json")
        if (jsondata) {
           gaadiUrl=jsondata.filter(car => car.model===model)[0].imgurl
        }
        return {
          gaadiUrl:gaadiUrl,
          availableGaadis:availableGaadis
        };
    } catch (e) {
        console.error("Error occurred while fetching allAvailableGaadisForACity:", e);
        return { error: e.message };
    }
};
