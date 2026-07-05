import { test, expect } from "../utils/fixtures";

test("Get Articles", async ({ api }) => {
  const responseBody = await api
    .path("/articles")
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);

  console.log(responseBody);

  expect(responseBody.articles.length).toBeLessThanOrEqual(10);
  expect(responseBody.articlesCount).toBeLessThanOrEqual(10);
});

test("Get Tags", async ({ api }) => {
  const responseBody = await api.path("/tags").getRequest(200);

  expect(responseBody.tags[0]).toBe("Test");
  expect(responseBody.tags.length).toBeLessThanOrEqual(10);
});
