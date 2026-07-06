import { request } from "@playwright/test";
import { APILogger } from "../utils/logger";
import { RequestHandler } from "../utils/request-handler";
import { config } from "../api-test.config";

export async function createToken(email: string, password: string) {
  const context = await request.newContext();
  const logger = new APILogger();
  const api = new RequestHandler(context, config.apiUrl, logger);

  try {
    const tokenResponseBody = await api
      .path("/users/login")
      .body({
        user: { email: email, password: password },
      })
      .postRequest(200);

    return `Token ${tokenResponseBody.user.token}`;
  } catch (error) {
    Error.captureStackTrace(error as Error, createToken);
    throw error;
  } finally {
    context.dispose();
  }
}
