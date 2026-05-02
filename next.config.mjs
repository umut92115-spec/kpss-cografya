/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  trailingSlash: false,
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.kpsscografya.com',
          },
        ],
        destination: 'https://kpsscografya.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
