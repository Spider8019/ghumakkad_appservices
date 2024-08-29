// This function is the endpoint's request handler.
exports = async function({ query, headers, body}, response) {
    try {
        const mongodb = context.services.get("mongodb-atlas");
        const mvCollection = mongodb.db("nodeapp").collection("markVisited");
        const jsonData = JSON.parse(body.text());
        
        // Check if the required fields are present
        if (!jsonData || !jsonData.userId || !jsonData.id) {
            response.setStatusCode(400); // Bad Request
            response.setBody(JSON.stringify({ error: "Missing required fields: userId and id" }));
            return;
        }
        
        // Delete the document based on the userId and id
        const result = await mvCollection.deleteOne({ userId: jsonData.userId, id: jsonData.id });
        
        if (result.deletedCount === 1) {
            response.setStatusCode(200); // OK
            response.setBody(JSON.stringify({ success: true, message: "Document deleted successfully." }));
        } else {
            response.setStatusCode(404); // Not Found
            response.setBody(JSON.stringify({ success: false, message: "Document not found." }));
        }
    } catch (e) {
        console.error("Error occurred while deleting marking", e);
        response.setStatusCode(500); // Internal Server Error
        response.setBody(JSON.stringify({ error: e.message }));
    }
};
