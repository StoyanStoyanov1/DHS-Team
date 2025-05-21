/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Uncommented for deployment
    output: 'export',
    images: {
        unoptimized: true
    },
    // Add trailingSlash for better Firebase hosting compatibility
    trailingSlash: true,
    // Add assetPrefix for Firebase hosting
    assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',

    // Environment variables that will be available at build time
    env: {
    }
}

module.exports = nextConfig;
