//发布阶段需要用到的babel插件
const prodPlugins = []
if(process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    //...展开运算符，将prodPlugins数组的每一项展开 
    //发布产品时的插件
    ...prodPlugins,
    //路由懒加载 (优化)
    '@babel/plugin-syntax-dynamic-import'
  ]
}