import { transform } from '@formatjs/ts-transformer'
// webpack config
module.exports = {
  rules: [
    {
      test: /\.tsx?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            getCustomTransformers() {
              return {
                before: [
                  transform({
                    overrideIdFn: '[sha512:contenthash:base64:6]',
                  }),
                ],
              }
            },
          },
        },
      ],
      exclude: /node_modules/,
    },
  ],
}