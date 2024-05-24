module.exports = {
    module: {
      rules: [
        {
          test: /\.Codebox\.js$/,
          use: { loader: 'worker-loader' },
        },
      ],
    },
  };
  