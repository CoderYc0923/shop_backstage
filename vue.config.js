const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
 
module.exports = {
  chainWebpack: config => {
    //发布阶段webpack打包入口
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')


      //通过externals节点加载外部CDN资源，1.在externals节点中声明一些不需要打包的第三方依赖包,从而优化打包后单文件体积过大的问题
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      //新增isProd 来判断是开发模式还是发布模式 从而让首页title按需变更
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    }) 
    //开发阶段webpack打包入口
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    }) 
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("plugins", resolve("src/plugins"))
      .set("router", resolve("src/router"))
      .set("views", resolve("src/views"))
      .set("base", resolve("baseConfig"))
      .set("public", resolve("public"));
  },
}