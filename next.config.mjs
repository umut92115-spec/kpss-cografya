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
            value: 'www.kpsscografya.com.tr.tr',
          },
        ],
        destination: 'https://kpsscografya.com.tr.tr/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
