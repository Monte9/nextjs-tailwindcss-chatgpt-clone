/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    APP_ENV: process.env.APP_ENV,
    APP_NAME: process.env.APP_NAME
  }
}

module.exports = nextConfig
