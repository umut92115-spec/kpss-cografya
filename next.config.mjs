/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  trailingSlash: false,
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      // www → non-www kalıcı yönlendirme
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.kpsscografya.com.tr',
          },
        ],
        destination: 'https://kpsscografya.com.tr/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
