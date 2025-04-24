/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true,
        domains: ['localhost'],
    },
    trailingSlash: true
}

module.exports = nextConfig;