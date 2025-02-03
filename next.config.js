/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Remove kerberos from the webpack alias, added by Cassandra Client
    config.resolve.alias = {
      ...config.resolve.alias,
      kerberos: false,
    };
    return config;
  },
};

export default nextConfig;
