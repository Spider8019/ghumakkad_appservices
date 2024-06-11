// This function is the endpoint's request handler.
exports = async function ({ query, headers, body }, response) {
  try {
    const mongodb = context.services.get("mongodb-atlas");
    const qaCollection = mongodb.db("nodeapp").collection("quickattractions");
    const jsonData = JSON.parse(body.text());

    if (
      !jsonData ||
      !jsonData.labelForTitle ||
      !jsonData.title ||
      !jsonData.attractions ||
      !jsonData.createdBy
    ) {
      return {
        error:
          "Missing required fields: title, description, attractions, createdBy",
        body,
        query,
        jsonData,
      };
    }
    // Define the filter based on the _id field
    const filter = { _id: jsonData._id };

    // Define the update operation
    const newObject = {
      labelForTitle: jsonData.labelForTitle,
      title: jsonData.title,
      attractions: jsonData.attractions,
      enabled: jsonData.enabled || true,
      coverImage: jsonData.coverImage || "",
      public: jsonData.public || true,
      createdBy: jsonData.createdBy,
      updatedAt: jsonData.updatedAt || Date.now(),
      createdAt: jsonData.createdAt || Date.now(),
    };

    const update = {
      $set: newObject,
    };

    // Use the upsert option to insert or update the document
    return qaCollection
      .updateOne(filter, update, { upsert: true })
      .then((result) => {
        return { ...result, ...jsonData };
      })
      .catch((err) => {
        return { ...err,msg:err.message,newObject };
      });

    // return qaCollection.insertOne(jsonData)
    //   .then(result => {return {...result,...jsonData}})
    //   .catch(err => {return {...err}})
  } catch (e) {
    console.error("Error occurred while fetching attractions:", e);
    return { error: e.message };
  }
};
