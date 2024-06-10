const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  // other webpack config options...
  plugins: [
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/service-worker.js', // source service worker file
      swDest: 'service-worker.js', // output service worker file
    }),
  ],
};
