/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    AWS_REGION: process.env.AWS_REGION || 'ap-southeast-6',
    DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME || 'feijoa-stack-table',
  }
}

module.exports = nextConfig
