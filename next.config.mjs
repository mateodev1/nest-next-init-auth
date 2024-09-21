/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // output: "standalone",
  // webpackDevMiddleware: (config) => {
  //   config.watchOptions = {
  //     poll: 1000, // Intervalo de polling (cada segundo)
  //     aggregateTimeout: 300, // Retrasa la recarga hasta que haya cambios
  //   };
  //   return config;
  // },
};

export default nextConfig;
