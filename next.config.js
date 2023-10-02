const path = require('path');

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Add the file-loader rule for mp4 and webm video files
    config.module.rules.push({
      test: /\.(mp4|webm)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/videos",
          outputPath: `${isServer ? "../" : ""}static/videos/`,
          name: "[name].[ext]",
          esModule: false,
        },
      },
    });

    // Define any other custom configurations you need here

    // Important: return the modified config
    config.externals.push({ sharp: 'commonjs sharp' });
    return config;
  },
};
