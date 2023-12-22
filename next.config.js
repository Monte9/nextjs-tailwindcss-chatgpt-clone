/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    GEMINI_API: process.env.GEMINI_API
  }
}

module.exports = nextConfig
