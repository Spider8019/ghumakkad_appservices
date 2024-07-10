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

    if (placeCategories) {
      const categoriesArray = placeCategories.split(",");
      const categoryRegexConditions = categoriesArray.map((category) => ({
        placeCategory: { $regex: category.trim(), $options: "i" },
      }));

      switch (true) {
        case !!placeName && !!placeCategories:
          filter = {
            $and: [
              { $or: categoryRegexConditions },
              {
                $or: [
                  {
                    "placeLocation.text": { $regex: placeName, $options: "i" },
                  },
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
            $or: categoryRegexConditions,
          };
          break;

        default:
          break;
      }
    } else if (placeName) {
      filter = {
        $or: [
          { "placeLocation.text": { $regex: placeName, $options: "i" } },
          { placeName: { $regex: placeName, $options: "i" } },
        ],
      };
    }

    let possibleAttractions = await doc
      .find(filter, {
        placeName: 1,
        placeImage: 1,
        placeCity: 1,
        placeCategory: 1,
      })
      .sort({ placeName: 1 })
      .toArray();

    console.log(possibleAttractions);

    return possibleAttractions;
  } catch (e) {
    console.error("Error occurred while fetching attractions:", e);
    return { error: e.message };
  }
};
