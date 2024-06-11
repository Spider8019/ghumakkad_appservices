// This function is the endpoint's request handler.
exports = async function({ query, headers, body }, response) {
    const mongodb = context.services.get("mongodb-atlas");
    const qaCollection = mongodb.db("nodeapp").collection("quickattractions");
    const ObjectId = mongodb.ObjectId;

    try {
        const jsonData = JSON.parse(body.text());

        if (!jsonData || !jsonData.labelForTitle || !jsonData.title || !jsonData.attractions || !jsonData.createdBy) {
            return { error: "Missing required fields: labelForTitle, title, attractions, createdBy", body, query, jsonData };
        }

        // Check and convert hex strings in attractions to ObjectId
        if (Array.isArray(jsonData.attractions)) {
            jsonData.attractions = jsonData.attractions.map(attraction => {
                if (typeof attraction === 'string' && ObjectId.isValid(attraction)) {
                    return new ObjectId(attraction);
                } else {
                    throw new Error(`Invalid ObjectId hex string: ${attraction}`);
                }
            });
        } else {
            throw new Error("Attractions should be an array of hex strings.");
        }

        const result = await qaCollection.insertOne(jsonData);
        return { ...result, ...jsonData, objectID: result.insertedId };

    } catch (e) {
        console.error("Error occurred while processing attractions:", e);
        return { error: e.message };
    }
};
