module.exports = {
  // css相关配置 配置高于chainWebpack中关于css loader的配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?是否在构建样式地图，false将提高构建速度
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      sass: {
        prependData: `
             @import "@/assets/scss/_variable.scss";
           `,
      },
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
  },
};
