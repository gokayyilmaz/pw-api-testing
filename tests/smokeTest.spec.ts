import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect"
import { faker } from "@faker-js/faker";
import { APILogger } from "../utils/logger";

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

test("logger", () => {
  const logger = new APILogger()
  logger.logRequest("GET", "https://test.com/api", {Authorization: "token"}, {foo: "bar"})
  logger.logResponse(200, {foo: "bar"})
  const logs = logger.getRecentLogs()
  console.log(logs)
})

test("Get Articles", async ({ api }) => {
  const getArticlesResponseBody = await api
    .path("/articles")
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);

  expect(getArticlesResponseBody.articles.length).shouldBeLessThanOrEqual(10);
  expect(getArticlesResponseBody.articlesCount).shouldEqual(10)
});

test("Get Tags", async ({ api }) => {
  const getTagsResponseBody = await api.path("/tags").getRequest(200);

  expect(getTagsResponseBody.tags[0]).shouldEqual("Test");
  expect(getTagsResponseBody.tags.length).shouldBeLessThanOrEqual(10);
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

  expect(createArticleResponseBody.article.title).shouldEqual(
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

  expect(getArticlesResponseBody.articles[0].title).shouldEqual(
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

  expect(getArticlesResponseBodyTwo.articles[0].title).not.shouldEqual(
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

  expect(createArticleResponseBody.article.title).shouldEqual(
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

  expect(updateArticleResponseBody.article.title).shouldEqual(
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

  expect(getArticlesResponseBody.articles[0].title).shouldEqual(
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

  expect(getArticlesResponseBodyTwo.articles[0].title).not.shouldEqual(
    `testTitle${randomNumber}`,
  );
  expect(getArticlesResponseBodyTwo.articles[0].title).not.shouldEqual(
    `testTitle${randomNumber} updated`,
  );
});
