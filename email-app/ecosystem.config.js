module.exports = {
  apps: [
    {
      name: "email-api",
      script: "apps/api/dist/index.js",
      instances: 1,
    }
  ]
}