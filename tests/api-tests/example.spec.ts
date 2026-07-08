import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

let randomNumber: number;
let token: string;

test.beforeAll(async ({ request }) => {
  const loginResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: { user: { email: "gokay@test.com", password: "test1234" } },
    },
  );
  const loginResponseBody = await loginResponse.json();
  token = `Token ${loginResponseBody.user.token}`;
});

test.beforeEach(async () => {
  randomNumber = faker.number.int({
    min: 1000,
    max: 5000,
  });
});

test("get test tags", async ({ request }) => {
  const response = await request.get(
    "https://conduit-api.bondaracademy.com/api/tags/",
  );
  const responseBody = await response.json();

  expect(response.status()).toBe(200);
  expect(responseBody.tags[0]).toBe("Test");
  expect(responseBody.tags.length).toBeLessThanOrEqual(10);
});

test("get all articles", async ({ request }) => {
  const response = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
  );
  const responseBody = await response.json();

  expect(response.status()).toBe(200);
  expect(responseBody.articles.length).toBeLessThanOrEqual(10);
  expect(responseBody.articlesCount).toBeLessThanOrEqual(10);
});

test("create and delete article", async ({ request }) => {
  const createArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: {
        article: {
          title: `testTitle${randomNumber}`,
          description: `testDescription${randomNumber}`,
          body: `testBody${randomNumber}`,
          tagList: [],
        },
      },
      headers: {
        Authorization: token,
      },
    },
  );

  const createArticleResponseBody = await createArticleResponse.json();
  expect(createArticleResponse.status()).toBe(201);
  expect(createArticleResponseBody.article.title).toBe(
    `testTitle${randomNumber}`,
  );
  const slugId = createArticleResponseBody.article.slug;

  const getArticlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
    {
      headers: {
        Authorization: token,
      },
    },
  );
  const getArticlesResponseBody = await getArticlesResponse.json();
  expect(getArticlesResponse.status()).toBe(200);
  expect(getArticlesResponseBody.articles[0].title).toBe(
    `testTitle${randomNumber}`,
  );

  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
    {
      headers: {
        Authorization: token,
      },
    },
  );
  expect(deleteArticleResponse.status()).toBe(204);
});

test("create, update, delete article", async ({ request }) => {
  const createArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: {
        article: {
          title: `testTitle${randomNumber}`,
          description: `testDescription${randomNumber}`,
          body: `testBody${randomNumber}`,
          tagList: [],
        },
      },
      headers: {
        Authorization: token,
      },
    },
  );

  const createArticleResponseBody = await createArticleResponse.json();
  expect(createArticleResponse.status()).toBe(201);
  expect(createArticleResponseBody.article.title).toBe(
    `testTitle${randomNumber}`,
  );
  const slugId = createArticleResponseBody.article.slug;

  const updateArticleResponse = await request.put(
    `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
    {
      data: {
        article: {
          title: `testTitle${randomNumber} updated`,
          description: `testDescription${randomNumber}`,
          body: `testBody${randomNumber}`,
          tagList: [],
        },
      },
      headers: {
        Authorization: token,
      },
    },
  );

  const updateArticleResponseBody = await updateArticleResponse.json();
  expect(updateArticleResponse.status()).toBe(200);
  expect(updateArticleResponseBody.article.title).toBe(
    `testTitle${randomNumber} updated`,
  );
  const slugIdUpdated = updateArticleResponseBody.article.slug;

  const getArticlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
    {
      headers: {
        Authorization: token,
      },
    },
  );
  const getArticlesResponseBody = await getArticlesResponse.json();
  expect(getArticlesResponse.status()).toBe(200);
  expect(getArticlesResponseBody.articles[0].title).toBe(
    `testTitle${randomNumber} updated`,
  );

  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${slugIdUpdated}`,
    {
      headers: {
        Authorization: token,
      },
    },
  );
  expect(deleteArticleResponse.status()).toBe(204);
});
