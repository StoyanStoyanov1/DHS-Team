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
        // Debug authentication is enabled by default in development mode
        // To disable debug mode, set this to 'false'
        // In production, debug mode is OFF by default unless explicitly set to 'true'
        NEXT_PUBLIC_DEBUG_AUTH: 'true',
    }
}

module.exports = nextConfig;
