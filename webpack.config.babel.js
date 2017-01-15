import BabiliPlugin from 'babili-webpack-plugin';
import {join} from 'path';

const context = join(__dirname, 'src');

export default {
  context,
  entry: './index',
  output: {
    path: join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'PSub',
  },
  plugins: [
    new BabiliPlugin(),
  ],
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: context,
      },
    ],
  },
};
