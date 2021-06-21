const CracoAntDesignPlugin = require('craco-antd');
const dotenv = require('dotenv');

const { DefinePlugin } = require('webpack');
dotenv.config();

const setWebpackTarget = (config) => {
  config.target = 'electron-renderer';
  return config;
};

const setWebpackPublicPath = (config) => {
  if (config.output) {
    config.output.publicPath = '';
  } else {
    config.output = { publicPath: '' };
  }
  return config;
};

const setEnvPlugin = new DefinePlugin({
  'process.env.UNSPLASH_ACCESSKEY': JSON.stringify(
    process.env.UNSPLASH_ACCESSKEY
  ),
  'process.env.UNSPLASH_SECRET': JSON.stringify(process.env.UNSPLASH_SECRET),
  'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
  'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(
    process.env.FIREBASE_AUTH_DOMAIN
  ),
  'process.env.FIREBASE_DATABASE_URL': JSON.stringify(
    process.env.FIREBASE_DATABASE_URL
  ),
  'process.env.FIREBASE_PROJECT_ID': JSON.stringify(
    process.env.FIREBASE_PROJECT_ID
  ),
  'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(
    process.env.FIREBASE_STORAGE_BUCKET
  ),
  'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(
    process.env.FIREBASE_MESSAGING_SENDER_ID
  ),
  'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID),
  'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(
    process.env.FIREBASE_MEASUREMENT_ID
  ),
});

module.exports = {
  webpack: {
    plugins: [setEnvPlugin],
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          if (process.env.BROWSER === 'none') {
            webpackConfig = setWebpackPublicPath(webpackConfig);
            webpackConfig = setWebpackTarget(webpackConfig);
          }
          return webpackConfig;
        },
      },
    },
    {
      plugin: CracoAntDesignPlugin,
    },
  ],
};
