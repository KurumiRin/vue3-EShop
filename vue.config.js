const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, 'assets/styles/variables.less'),
        path.join(__dirname, 'assets/styles/mixins.less')
      ]
    }
  }
}
