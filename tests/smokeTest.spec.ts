import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";
import articleRequestPayload from "../request-objects/POST-article.json";
import { faker } from "@faker-js/faker";
import { getNewRandomArticle } from "../utils/data-generator";

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
  const articleRequest = getNewRandomArticle()
  const createArticleResponseBody = await api
    .path("/articles")
    .body(articleRequest)
    .postRequest(201);
  await expect(createArticleResponseBody).shouldMatchSchema(
    "articles",
    "POST_articles",
  );
  expect(createArticleResponseBody.article.title).shouldEqual(articleRequest.article.title);
  const slugId = createArticleResponseBody.article.slug;

  const getArticlesResponseBody = await api
    .path("/articles")
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);

  expect(getArticlesResponseBody.articles[0].title).shouldEqual(
    articleRequest.article.title,
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
    articleRequest.article.title,
  );
});

test("Create, Update and Delete Article", async ({ api }) => {
  const articleTitle = faker.lorem.sentence(5);
  const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload));
  articleRequest.article.title = articleTitle;
  const createArticleResponseBody = await api
    .path("/articles")
    .body(articleRequest)
    .postRequest(201);

  expect(createArticleResponseBody.article.title).shouldEqual(articleTitle);
  const slugId = createArticleResponseBody.article.slug;

  const articleTitleModified = faker.lorem.sentence(5);
  articleRequest.article.title = articleTitleModified;
  const updateArticleResponseBody = await api
    .path(`/articles/${slugId}`)
    .body(articleRequest)
    .putRequest(200);

  expect(updateArticleResponseBody.article.title).shouldEqual(
    articleTitleModified,
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
    articleTitleModified,
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
    articleTitle,
  );
  expect(getArticlesResponseBodyTwo.articles[0].title).not.shouldEqual(
    articleTitleModified,
  );
});
