import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

const processENV = process.env.TEST_ENV;
const env = processENV || "dev";
console.log("Test environment is: " + env);

const config = {
  apiUrl: "https://conduit-api.bondaracademy.com/api",
  userEmail: "gokay@test.com",
  userPassword: "test1234",
};

if (env === "qa") {
  config.userEmail = "gokay2@test.com";
  config.userPassword = "test1234";
}

if (env === "prod") {
  if (!process.env.PROD_USERNAME || !process.env.PROD_PASSWORD) {
    throw Error("Missing required environment variables");
  }
  config.userEmail = process.env.PROD_USERNAME;
  config.userPassword = process.env.PROD_PASSWORD;
}

export { config };
