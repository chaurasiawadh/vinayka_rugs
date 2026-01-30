const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
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

const isGithubActions = process.env.GITHUB_ACTIONS || false;

if (isGithubActions) {
  nextConfig.output = 'export';
}

export default nextConfig;
