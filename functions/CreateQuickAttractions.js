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
    
    // Define the filter based on the _id field
    let filter;
    if (jsonData._id==null) {
      return qaCollection.insertOne(newObject)
          .then(result => {return {...result,...jsonData,msg:"data inserted successfully"}})
          .catch(err => {return {...err, error_msg:err.message}})
    }else{
       return qaCollection
        .updateOne({_id:new BSON.ObjectId(jsonData._id)},{$set:newObject})
        .then((result) => {
          return { ...result, ...jsonData, msg:"data updated successfully" };
        })
        .catch((err) => {
          return { ...err,newObject,error_msg:err.message };
        });
    }

  } catch (e) {
    console.error("Error occurred while fetching attractions:", e);
    return { error: e.message };
  }
};
