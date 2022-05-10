/*
 * @Description:
 * @Author: candyxli
 * @Date: 2021-10-20 10:55:05
 * @LastEditors: candyxli
 * @LastEditTime: 2022-01-17 16:28:27
 */
module.exports = {
  publicPath:
    process.env.NODE_ENV === "development" ? "/" : "/",
  pages: {
    index: {
      // page 的入口
      entry: "src/main.js",
      filename: "index.html",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"]
    }
  },
  devServer: {
    transportMode: "ws"
  },
  productionSourceMap: false
};
