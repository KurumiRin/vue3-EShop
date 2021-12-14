const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
  },

  // devServer: {
  //   overlay: {
  //     errors: true
  //     warnings: false
  //   }
  // },

  // 这个是给webpack-dev-server开启可IP和域名访问权限。
  chainWebpack: config => {
    config.devServer.disableHostCheck(true)
  },
  //  这个是设置外部扩展，模块为qc变量名为QC，导入qc将不做打包。
  configureWebpack: {
    externals: {
      // qc 模块名
      // 'QC' 全局变量
      qc: 'QC'
    }
  }
}
