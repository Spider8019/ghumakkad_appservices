exports = async function FetchInfoFromLink(url) {
  const response = await context.http.get({ url: url})
  return EJSON.parse(response.body.text());
};