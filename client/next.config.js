//This function is loaded at the same time with next project
//It tells Next to pull any file differences automatically every 300ms
module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};

//This is required for Bootstrap CSS to work with NEXT
const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  cssLoaderOptions: {
    url: false,
  },
});
