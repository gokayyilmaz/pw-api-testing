import { test, expect } from '@playwright/test';

test('get test tags', async ({ request }) => {
  const response = await request.get("https://conduit-api.bondaracademy.com/api/tags/")
  const responseBody = await response.json()

  expect(response.status()).toBe(200)
  expect(responseBody.tags[0]).toBe("Test")
  expect(responseBody.tags.length).toBeLessThanOrEqual(10)
});

test("get all articler", async ({ request }) => {
  const response = await request.get("https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0")
  const responseBody = await response.json()
  
  expect(response.status()).toBe(200)
  expect(responseBody.articles.length).toBeLessThanOrEqual(10)
  expect(responseBody.articlesCount).toBeLessThanOrEqual(10)
})
