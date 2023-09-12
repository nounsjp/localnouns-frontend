const webpack = require('webpack');

const pages = (() => {
  const retObj = {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      description: " ** Local Nouns ** Memorize Japanese landmarks and specialties forever with full-on chain NFT.",
    },
    indexja: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: `index-ja.html`,
      description: "【ご当地ナウンズ】日本の名所・特産品をフルオンチェーンNFTで永遠に...",
    },
  };
  return retObj;
})();

module.exports = {
  pages,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    resolve: {
      fallback: {
        "buffer": require.resolve('buffer/'),
        "http": 'agent-base',
        "https": 'agent-base',
        "stream": false,
        "crypto": false,
        "os": false,
        "url": false,
        "assert": false,
      }
    }
  }
};
