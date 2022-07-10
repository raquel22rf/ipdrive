/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/drive',
        permanent: true,
      },
    ];
  },
	experiments: {
		topLevelAwait: true,
	}
}

module.exports = nextConfig
