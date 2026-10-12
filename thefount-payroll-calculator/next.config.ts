import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/payroll',
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://www.thefount.co.kr/payroll',
        permanent: true,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
