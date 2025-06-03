import { NextConfig } from 'next';

const config: NextConfig = {
  // Ensure the IndexNow key file is served from the root
  async rewrites() {
    return [
      {
        source: '/80cd11cf3a544e6593c65a4c3e9c4a68.txt',
        destination: '/public/80cd11cf3a544e6593c65a4c3e9c4a68.txt',
      },
    ];
  },
};

export default config;
