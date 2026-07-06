const processENV = process.env.TEST_ENV
const env = processENV || "dev"
console.log("Tes environment is: " + env)

const config = {
  apiUrl: "https://conduit-api.bondaracademy.com/api",
  userEmail: "gokay@test.com",
  userPassword: "test1234",
}

if (env === "qa" ) {
  config.userEmail = "gokay2@test.com",
  config.userPassword = "test1234"
}

if (env === "prod" ) {
  config.userEmail = "gokay3@test.com",
  config.userPassword = "test1234"
}

export {config}
