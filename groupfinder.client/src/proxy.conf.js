const PROXY_CONFIG = [
  {
    context: [
      "/api/game",
      "/api/race",
      "/api/user",
      "/identity/refresh",
      "/identity/login",
      "/identity/register",
    ],
    target: "https://localhost:7154",
    secure: false
  }
]

// eslint-disable-next-line no-undef
module.exports = PROXY_CONFIG;
