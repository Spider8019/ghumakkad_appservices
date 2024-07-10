// This function is the endpoint's request handler.
exports = async function ({ query, headers, body }, response) {
  const doc = context.services
    .get("mongodb-atlas")
    .db("nodeapp")
    .collection("places");
  const { placeName, placeCategories } = query;

  console.log(placeName);
  console.log(placeCategories);

  try {
    let filter = {};

    switch (true) {
      case !!placeName && !!placeCategories:
        filter = {
          $and: [
            { placeCategory: { $in: placeCategories.split(",") } },
            {
              $or: [
                { "placeLocation.text": { $regex: placeName, $options: "i" } },
                { placeName: { $regex: placeName, $options: "i" } },
              ],
            },
          ],
        };
        break;

      case !!placeName:
        filter = {
          $or: [
            { "placeLocation.text": { $regex: placeName, $options: "i" } },
            { placeName: { $regex: placeName, $options: "i" } },
          ],
        };
        break;

      case !!placeCategories:
        filter = {
          placeCategory: { $in: placeCategories.split(",") },
        };
        break;

      default:
        break;
    }

    let possibleAttractions = await doc
      .find(filter, { placeName: 1, placeImage: 1, placeCity: 1 })
      .sort({ placeName: 1 })
      .toArray();

    console.log(possibleAttractions);

    return possibleAttractions;
  } catch (e) {
    console.error("Error occurred while fetching attractions:", e);
    return { error: e.message };
  }
};
