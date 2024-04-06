// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
  
    const doc = context.services.get("mongodb-atlas").db("nodeapp").collection("places");

    try {
        let getAllCitiesUnformatted = await doc.aggregate([
              {
                $match: {
                  $or: [{ placeEnabled: true }, { placeEnabled: { $exists: false } }],
                },
              },
              {
                $group: {
                  _id: '$placeCity',
                  count: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  city: '$_id',
                  count: 1,
                  tier: {
                    $switch: {
                      branches: [
                        { case: { $gte: ['$count', 12] }, then: 'tier1' },
                        { case: { $gte: ['$count', 5] }, then: 'tier2' },
                      ],
                      default: 'tier3',
                    },
                  },
                },
              },
              {
                $group: {
                  _id: '$tier',
                  cities: { $addToSet: '$city' },
                },
              },
              {
                $project: {
                  _id: 0,
                  tier: '$_id',
                  cities: 1,
                },
              },
            ])
            .toArray();
            
        const data = getAllCitiesUnformatted.reduce((acc, obj) => {
          acc[obj.tier] = obj.cities
          return acc
        }, {})
        
        const jsondata= await context.functions.execute("FetchInfoFromLink","https://raw.githubusercontent.com/Spider8019/json_config/master/cities.json")
        if (jsondata) {

          const cityArray = Object.keys(jsondata).map((city) => ({
            city,
            ...jsondata[city],
          }))

          const getAllCitiesFormatted = {
            tier1: cityArray.filter((cityObj) =>
              data.tier1.includes(cityObj.city),
            ),
            tier2: cityArray.filter((cityObj) =>
              data.tier2.includes(cityObj.city),
            ),
            tier3: cityArray.filter((cityObj) =>
              data.tier3.includes(cityObj.city),
            ),
          }
          return getAllCitiesFormatted;
        }
    } catch (e) {
        console.error("Error occurred while fetching attractions:", e);
        return { error: e.message };
    }
};