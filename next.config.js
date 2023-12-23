/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_GEMINI_KEY: process.env.NEXT_PUBLIC_GEMINI_KEY
  }
}

module.exports = nextConfig
