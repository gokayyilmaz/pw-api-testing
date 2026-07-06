import { test as base, expect } from "@playwright/test";
import { RequestHandler } from "./request-handler";
import { APILogger } from "./logger";
import { setCustomExpectLogger } from "./custom-expect";
import { config } from "../api-test.config";
import { createToken } from "../helpers/createToken";

export type TestOptions = {
  api: RequestHandler;
  config: typeof config;
};

export type WorkerFixture = {
  token: string;
};

export const test = base.extend<TestOptions, WorkerFixture>({
  token: [
    async ({}, use) => {
      const token = await createToken(config.userEmail, config.userPassword);
      await use(token);
    },
    { scope: "worker" },
  ],

  api: async ({ request, token }, use) => {
    const baseUrl = "https://conduit-api.bondaracademy.com/api";
    const logger = new APILogger();
    setCustomExpectLogger(logger);
    const requestHandler = new RequestHandler(
      request,
      config.apiUrl,
      logger,
      token,
    );
    await use(requestHandler);
  },
  config: async ({}, use) => {
    await use(config);
  },
});
