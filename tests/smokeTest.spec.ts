import { test, expect } from "../utils/fixtures";
import { faker } from "@faker-js/faker";

let randomNumber: number;
let token: string;

test.beforeAll(async ({ api }) => {
  const tokenResponseBody = await api
    .path("/users/login")
    .body({
      user: { email: "gokay@test.com", password: "test1234" },
    })
    .postRequest(200);

  token = `Token ${tokenResponseBody.user.token}`;

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

  expect(getArticlesResponseBody.articles.length).toBeLessThanOrEqual(10);
  expect(getArticlesResponseBody.articlesCount).toBeLessThanOrEqual(10);
});

test("Get Tags", async ({ api }) => {
  const getTagsResponseBody = await api.path("/tags").getRequest(200);

  expect(getTagsResponseBody.tags[0]).toBe("Test");
  expect(getTagsResponseBody.tags.length).toBeLessThanOrEqual(10);
});

test("Create and Delete Article", async ({ api }) => {
  const createArticleResponseBody = await api
    .path("/articles")
    .headers({ Authorization: token })
    .body({
      article: {
        title: `testTitle${randomNumber}`,
        description: `testDescription${randomNumber}`,
        body: `testBody${randomNumber}`,
        tagList: [],
      },
    })
    .postRequest(201);

  expect(createArticleResponseBody.article.title).toBe(
    `testTitle${randomNumber}`,
  );
  const slugId = createArticleResponseBody.article.slug;

  const getArticlesResponseBody = await api
    .path("/articles")
    .headers({ Authorization: token })
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);

  expect(getArticlesResponseBody.articles[0].title).toBe(
    `testTitle${randomNumber}`,
  );

  await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: token })
    .deleteRequest(204);

  const getArticlesResponseBodyTwo = await api
    .path("/articles")
    .headers({ Authorization: token })
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);

  expect(getArticlesResponseBodyTwo.articles[0].title).not.toBe(
    `testTitle${randomNumber}`,
  );
});

test("Create, Update and Delete Article", async ({ api }) => {
  const createArticleResponseBody = await api
    .path("/articles")
    .headers({ Authorization: token })
    .body({
      article: {
        title: `testTitle${randomNumber}`,
        description: `testDescription${randomNumber}`,
        body: `testBody${randomNumber}`,
        tagList: [],
      },
    })
    .postRequest(201);

  expect(createArticleResponseBody.article.title).toBe(
    `testTitle${randomNumber}`,
  );
  const slugId = createArticleResponseBody.article.slug;

  const updateArticleResponseBody = await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: token })
    .body({
      article: {
        title: `testTitle${randomNumber} updated`,
        description: `testDescription${randomNumber}`,
        body: `testBody${randomNumber}`,
        tagList: [],
      },
    })
    .putRequest(200);

  expect(updateArticleResponseBody.article.title).toBe(
    `testTitle${randomNumber} updated`,
  );
  const slugIdUpdated = updateArticleResponseBody.article.slug;

  const getArticlesResponseBody = await api
    .path("/articles")
    .headers({ Authorization: token })
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);

  expect(getArticlesResponseBody.articles[0].title).toBe(
    `testTitle${randomNumber} updated`,
  );

  await api
    .path(`/articles/${slugIdUpdated}`)
    .headers({ Authorization: token })
    .deleteRequest(204);

  const getArticlesResponseBodyTwo = await api
    .path("/articles")
    .headers({ Authorization: token })
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);

  expect(getArticlesResponseBodyTwo.articles[0].title).not.toBe(
    `testTitle${randomNumber}`,
  );
  expect(getArticlesResponseBodyTwo.articles[0].title).not.toBe(
    `testTitle${randomNumber} updated`,
  );
});
