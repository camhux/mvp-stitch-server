module.exports = {
  entry: __dirname + "/client/src/client.jsx",

  output: {
    path: __dirname + "/client/build",
    filename: "bundle.js"
  },

  module: {
    loaders: [
      {test: /\.jsx?$/, loader: "babel"}
    ]
  },

  resolve: {
    extensions: ["", ".js", ".jsx"]
  }
}