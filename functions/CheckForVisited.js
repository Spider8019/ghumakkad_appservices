exports = async function ({ query, headers, body }, response) {
  const doc = context.services
    .get("mongodb-atlas")
    .db("nodeapp")
    .collection("markVisited");

  try {
    const userId = query.userId;
    const id = query.id;

    // Check if the document exists
    const existingDoc = await doc.findOne({ userId, id });

    if (!existingDoc) {
      response.setStatusCode(200);
      return response.setBody(JSON.stringify({ existing: false }));
    }

    // Rename _id to insertedId
    const { _id, ...rest } = existingDoc;
    const result = { insertedId: _id, ...rest, existing: true };
    response.setStatusCode(200);
    return response.setBody(JSON.stringify(result));

  } catch (e) {
    console.error("Error occurred while fetching attractions:", e);

    response.setStatusCode(500); // Internal Server Error
    return response.setBody(JSON.stringify({ error: e.message }));
  }
};
