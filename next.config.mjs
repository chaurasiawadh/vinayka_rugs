/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    basePath: '/vinayka_rugs',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

export default nextConfig;
