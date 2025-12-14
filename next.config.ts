import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    experimental: {
        turbopackFileSystemCacheForDev: true
    },
    // Rewrites for PostHog ingestion endpoints
    async rewrites() {
        return [
            {
                source: "/ingest/static/:path*",
                destination: "https://eu-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/ingest/:path*",
                destination: "https://eu.i.posthog.com/:path*",
            },
        ];
    },
    // Support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
};

export default nextConfig;
