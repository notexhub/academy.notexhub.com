/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', ...config.resolve.extensions.filter(e => !['.js','.jsx','.ts','.tsx','.json'].includes(e))];
    return config;
  },
};

export default nextConfig;
