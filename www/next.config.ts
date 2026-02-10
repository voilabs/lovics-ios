import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    i18n: {
        locales: ["en", "tr"],
        defaultLocale: "tr",
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
};

export default nextConfig;
