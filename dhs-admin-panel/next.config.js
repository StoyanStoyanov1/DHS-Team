/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Uncommented for deployment
    output: 'export',
    images: {
        unoptimized: true
    },
    // Remove trailingSlash if not needed
    // trailingSlash: true,

    // Environment variables that will be available at build time
    env: {
    }
}

module.exports = nextConfig;
