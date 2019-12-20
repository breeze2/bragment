const { override } = require('customize-cra');

const setWebpackTarget = config => {
  config.target = 'electron-renderer';
  return config;
};

const setWebpackPublicPath = config => {
  if (config.output) {
    config.output.publicPath = '';
  } else {
    config.output = { publicPath: '' };
  }
  return config;
};

module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  webpack: override(setWebpackPublicPath, setWebpackTarget),
  // The Jest config to use when running your jest tests - note that the normal rewires do not
  // work here.
  jest: function(config) {
    return config;
  },
};
