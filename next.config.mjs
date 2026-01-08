const isProd = process.env.NODE_ENV === 'production';

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

if (isProd) {
    nextConfig.output = 'export';
    nextConfig.basePath = '/vinayka_rugs';
}

export default nextConfig;
