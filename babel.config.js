// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  "plugins": ["babel-plugin-rewire", "@babel/plugin-proposal-class-properties"]
}
