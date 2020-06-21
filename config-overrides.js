const {
  addWebpackPlugin,
  fixBabelImports,
  override,
} = require('customize-cra');
const dotenv = require('dotenv');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');

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

const setEnv = new webpack.DefinePlugin({
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

const monacoEditorPlugin = new MonacoEditorWebpackPlugin({
  filename: '[name].worker.js',
  publicPath: '',
  languages: [
    'abap',
    'apex',
    'azcli',
    'bat',
    'cameligo',
    'clojure',
    'coffee',
    'cpp',
    'csharp',
    'csp',
    'css',
    'dockerfile',
    'fsharp',
    'go',
    'graphql',
    'handlebars',
    'html',
    'ini',
    'java',
    'javascript',
    'json',
    'kotlin',
    'less',
    'lua',
    'markdown',
    'mips',
    'msdax',
    'mysql',
    'objective-c',
    'pascal',
    'pascaligo',
    'perl',
    'pgsql',
    'php',
    'postiats',
    'powerquery',
    'powershell',
    'pug',
    'python',
    'r',
    'razor',
    'redis',
    'redshift',
    'restructuredtext',
    'ruby',
    'rust',
    'sb',
    'scheme',
    'scss',
    'shell',
    'solidity',
    'sophia',
    'sql',
    'st',
    'swift',
    'tcl',
    'twig',
    'typescript',
    'vb',
    'xml',
    'yaml',
  ],
  features: [
    'accessibilityHelp',
    'bracketMatching',
    'caretOperations',
    'clipboard',
    'codeAction',
    '!codelens',
    '!colorDetector',
    'comment',
    '!contextmenu',
    'coreCommands',
    'cursorUndo',
    'dnd',
    'find',
    'folding',
    '!fontZoom',
    'format',
    '!gotoError',
    '!gotoLine',
    '!gotoSymbol',
    'hover',
    '!iPadShowKeyboard',
    'inPlaceReplace',
    'inspectTokens',
    'linesOperations',
    'links',
    'multicursor',
    'parameterHints',
    '!quickCommand',
    '!quickOutline',
    'referenceSearch',
    '!rename',
    'smartSelect',
    'snippets',
    'suggest',
    '!toggleHighContrast',
    '!toggleTabFocusMode',
    'transpose',
    'wordHighlighter',
    'wordOperations',
    'wordPartOperations',
  ],
});

module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  webpack: override(
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
    }),
    setWebpackPublicPath,
    setWebpackTarget,
    addWebpackPlugin(setEnv),
    addWebpackPlugin(monacoEditorPlugin)
  ),
  // The Jest config to use when running your jest tests - note that the normal rewires do not
  // work here.
  jest: function (config) {
    return config;
  },
};
