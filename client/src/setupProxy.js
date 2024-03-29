const {createProxyMiddleware}=require("http-proxy-middleware")

module.exports = function(app){
  app.use(
    createProxyMiddleware(
      "/api",
      {
        target: "http://192.168.10.147:8085",
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      }
    )
  )
}