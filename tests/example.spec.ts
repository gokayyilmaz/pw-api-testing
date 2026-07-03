import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

let randomNumber: number

test.beforeAll(async () => {
  randomNumber = faker.number.int({
    min: 1000,
    max: 5000
  })
})

test('get test tags', async ({ request }) => {
  const response = await request.get("https://conduit-api.bondaracademy.com/api/tags/")
  const responseBody = await response.json()

  expect(response.status()).toBe(200)
  expect(responseBody.tags[0]).toBe("Test")
  expect(responseBody.tags.length).toBeLessThanOrEqual(10)
});

test("get all articles", async ({ request }) => {
  const response = await request.get("https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0")
  const responseBody = await response.json()

  expect(response.status()).toBe(200)
  expect(responseBody.articles.length).toBeLessThanOrEqual(10)
  expect(responseBody.articlesCount).toBeLessThanOrEqual(10)
})

test("create article", async ({ request }) => {
  const loginResponse = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {
    data: { "user": { "email": "gokay@test.com", "password": "test1234" } }
  })
  const loginResponseBody = await loginResponse.json()
  const token = `Token ${loginResponseBody.user.token}`

  const createArticleResponse = await request.post("https://conduit-api.bondaracademy.com/api/articles/", {
    data: {
      "article": {
        "title": `testTitle${randomNumber}`,
        "description": `testDescription${randomNumber}`,
        "body": `testBody${randomNumber}`,
        "tagList": []
      }
    },
    headers: {
      "Authorization": token
    }
  })

  const createArticleResponseBody = await createArticleResponse.json()
  expect(createArticleResponse.status()).toBe(201);
  expect(createArticleResponseBody.article.title).toBe(`testTitle${randomNumber}`)

  const getArticlesResponse = await request.get("https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0", {
    headers: {
      "Authorization": token
    }
  })
  const getArticlesResponseBody = await getArticlesResponse.json()
  expect(getArticlesResponse.status()).toBe(200);
  expect(getArticlesResponseBody.articles[0].title).toBe(`testTitle${randomNumber}`)

})
