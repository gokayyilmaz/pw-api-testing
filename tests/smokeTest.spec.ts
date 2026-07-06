import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";
import { faker } from "@faker-js/faker";

let randomNumber: number;

test.beforeAll(async ({ api, config }) => {
  randomNumber = faker.number.int({
    min: 1000,
    max: 5000,
  });
});

test("Get Articles", async ({ api }) => {
  const getArticlesResponseBody = await api
    .path("/articles")
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);
  await expect(getArticlesResponseBody).shouldMatchSchema(
    "articles",
    "GET_articles",
  );
  expect(getArticlesResponseBody.articles.length).shouldBeLessThanOrEqual(10);
  expect(getArticlesResponseBody.articlesCount).shouldEqual(50);
});

test("Get Tags", async ({ api }) => {
  const getTagsResponseBody = await api.path("/tags").getRequest(200);
  await expect(getTagsResponseBody).shouldMatchSchema("tags", "GET_tags");
  expect(getTagsResponseBody.tags[0]).shouldEqual("Test");
  expect(getTagsResponseBody.tags.length).shouldBeLessThanOrEqual(10);
});

test("Create and Delete Article", async ({ api }) => {
  const createArticleResponseBody = await api
    .path("/articles")
    .body({
      article: {
        title: `testTitle${randomNumber}`,
        description: `testDescription${randomNumber}`,
        body: `testBody${randomNumber}`,
        tagList: [],
      },
    })
    .postRequest(201);
  await expect(createArticleResponseBody).shouldMatchSchema(
    "articles",
    "POST_articles",
  );
  expect(createArticleResponseBody.article.title).shouldEqual(
    `testTitle${randomNumber}`,
  );
  const slugId = createArticleResponseBody.article.slug;

  const getArticlesResponseBody = await api
    .path("/articles")
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);

  expect(getArticlesResponseBody.articles[0].title).shouldEqual(
    `testTitle${randomNumber}`,
  );

  await api.path(`/articles/${slugId}`).deleteRequest(204);

  const getArticlesResponseBodyTwo = await api
    .path("/articles")
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);

  expect(getArticlesResponseBodyTwo.articles[0].title).not.shouldEqual(
    `testTitle${randomNumber}`,
  );
});

test("Create, Update and Delete Article", async ({ api }) => {
  const createArticleResponseBody = await api
    .path("/articles")
    .body({
      article: {
        title: `testTitle${randomNumber}`,
        description: `testDescription${randomNumber}`,
        body: `testBody${randomNumber}`,
        tagList: [],
      },
    })
    .postRequest(201);

  expect(createArticleResponseBody.article.title).shouldEqual(
    `testTitle${randomNumber}`,
  );
  const slugId = createArticleResponseBody.article.slug;

  const updateArticleResponseBody = await api
    .path(`/articles/${slugId}`)
    .body({
      article: {
        title: `testTitle${randomNumber} updated`,
        description: `testDescription${randomNumber}`,
        body: `testBody${randomNumber}`,
        tagList: [],
      },
    })
    .putRequest(200);

  expect(updateArticleResponseBody.article.title).shouldEqual(
    `testTitle${randomNumber} updated`,
  );
  const slugIdUpdated = updateArticleResponseBody.article.slug;

  const getArticlesResponseBody = await api
    .path("/articles")
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);

  expect(getArticlesResponseBody.articles[0].title).shouldEqual(
    `testTitle${randomNumber} updated`,
  );

  await api.path(`/articles/${slugIdUpdated}`).deleteRequest(204);

  const getArticlesResponseBodyTwo = await api
    .path("/articles")
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);

  expect(getArticlesResponseBodyTwo.articles[0].title).not.shouldEqual(
    `testTitle${randomNumber}`,
  );
  expect(getArticlesResponseBodyTwo.articles[0].title).not.shouldEqual(
    `testTitle${randomNumber} updated`,
  );
});
