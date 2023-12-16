/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MIXPANEL_PROJECT_TOKEN: process.env.MIXPANEL_PROJECT_TOKEN,
    APP_ENV: process.env.APP_ENV,
    APP_NAME: process.env.APP_NAME
  }
}

module.exports = nextConfig
