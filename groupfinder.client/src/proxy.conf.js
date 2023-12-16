const PROXY_CONFIG = [
  {
    context: [
      "/api/game",
      "/api/race",
      "/api/weatherforecast",
      "/api/auth",
      "/api/user",
      "/identity/register",
    ],
    target: "https://localhost:7154",
    secure: false
  }
]

// eslint-disable-next-line no-undef
module.exports = PROXY_CONFIG;
