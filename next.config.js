/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Remove env section - use runtime environment variables instead
  // This allows the container to read AWS_REGION and DYNAMODB_TABLE_NAME at runtime
}

module.exports = nextConfig
