/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Comment out or remove the export setting for development
    // output: 'export',
    images: {
        unoptimized: true
    },
    // Remove trailingSlash if not needed
    // trailingSlash: true
}

module.exports = nextConfig;