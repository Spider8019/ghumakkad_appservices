// This function is the endpoint's request handler.
exports = async function ({ query, headers, body }, response) {
  const doc = context.services
    .get("mongodb-atlas")
    .db("nodeapp")
    .collection("places");
  const doc_tg = context.services
    .get("mongodb-atlas")
    .db("nodeapp")
    .collection("touristguides");
  const doc_e = context.services
    .get("mongodb-atlas")
    .db("nodeapp")
    .collection("events");
  const doc_rg = context.services
    .get("mongodb-atlas")
    .db("nodeapp")
    .collection("rentalgaadis");
  const doc_qa = context.services
    .get("mongodb-atlas")
    .db("nodeapp")
    .collection("quickattractions");
  const cityName = query.cityName;

  try {
    let allAttractionsInACity = await doc
      .find({ placeCity: cityName }, { placeName: 1, placeImage: 1 })
      .sort({ placeName: 1 })
      .toArray();

    let allTouristGuidesInACity = await doc_tg
      .find({ city: cityName }, { image: 1, name: 1, languages: 1, charge: 1 })
      .sort({ chargedByRS: 1 })
      .toArray();

    let allEventsInACity = await doc_e
      .find({ eventCities: { $in: [cityName] } })
      .sort({ tillDate: 1 })
      .toArray();
    allEventsInACity = allEventsInACity.map(async (event) => {
      if (event.eventPlace) {
        event.eventPlace = await doc.findOne(
          { _id: event.eventPlace },
          { placeName: 1 }
        );
      }
      return event;
    });

    let allRentalGaadiCategory = await doc_rg.distinct("gaadiModel", {
      cities: { $in: [cityName] },
    });
    const jsondata = await context.functions.execute(
      "FetchInfoFromLink",
      "https://raw.githubusercontent.com/Spider8019/json_config/master/gaadi.json"
    );
    if (jsondata) {
      allRentalGaadiCategory = jsondata.filter((car) =>
        allRentalGaadiCategory.includes(car.model)
      );
    }

    let allGroupedAttractions = await doc_qa
      .find(
        {
          // enabled: true,
          $or: [
            { title: { $regex: cityName, $options: "i" } }, // Case-insensitive search
            { labelForTitle: { $regex: cityName, $options: "i" } }, // Case-insensitive search
          ],
        },
        {
          title: 1,
          coverImage: 1,
        }
      )
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .toArray();

    return {
      allAttractionsInACity,
      allTouristGuidesInACity,
      allEventsInACity,
      allRentalGaadiCategory,
      allGroupedAttractions,
    };
  } catch (e) {
    console.error("Error occurred while fetching attractions:", e);
    return { error: e.message };
  }
};
