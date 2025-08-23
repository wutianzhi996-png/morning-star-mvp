/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生产环境优化
  poweredByHeader: false,
  compress: true,
  
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400,
  },
  
  // 编译优化
  swcMinify: true,
  
  // 环境变量（根据需要添加）
  env: {
    // CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 输出配置
  output: 'standalone',
  
  // 安全头部
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 