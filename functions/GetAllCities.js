exports = async function FetchInfoFromJSONUrl(url) {
  const response = await context.http.get({ url: url})
  return EJSON.parse(response.body.text());
};