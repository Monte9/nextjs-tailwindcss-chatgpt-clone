/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    APP_ENV: process.env.APP_ENV,
    APP_NAME: process.env.APP_NAME
  }
}

module.exports = nextConfig
