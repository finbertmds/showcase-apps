/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'minio.localhost',
      'your-s3-bucket.s3.amazonaws.com',
      // Add your S3/MinIO domains here
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
      },
    ];
  },
};

module.exports = nextConfig;
