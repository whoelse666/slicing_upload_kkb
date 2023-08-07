/*
 * @Author: RONGWEI PENG
 * @Date: 2020-05-06 16:47:08
 * @LastEditTime: 2020-05-12 22:58:21
 * @LastEditors: Do not edit
 * @FilePath: /my__kkb__project/front/nuxt.config.js
 * @Description:
 */

module.exports = {
  mode: "spa", //"universal",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["element-ui/lib/theme-chalk/index.css"],
  /*
   ** Plugins to load before mounting the App
   */
  /*   plugins: ["@/plugins/element-ui", "@/plugins/axios"], */
  plugins: [
    { src: "@/plugins/element-ui", mode: "client" },
    { src: "@/plugins/axios", mode: "client" }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/proxy"
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    analyze: true
  },
  /*
   ** 路由
   */
  router: {
    // middleware: "test", //使用中间件
    mode: "hash" //spa/history/hash
    //? 扩展Nuxt.js创建的路由  */
    //   extendRoutes(routes, resolve) {
    // /*     console.log('routes, resolve=>',routes, resolve);
    //     const index = routes.findIndex(route => route.name === "main");
    //     routes[index] = {
    //       ...routes[index],
    //       components: {
    //         default: routes[index].component,
    //         top: resolve(__dirname, "components/mainTop.vue")
    //       },
    //       chunkNames: {
    //         top: "components/mainTop"
    //       }
    //     }; */
    //   }
  },
  /* 映射代理 */
  proxy: {
    "/api/": {
      target: "http://localhost:7002",
      secure: false,
      pathRewrite: {
        "/api/": ""
      }
    }
  }
};
