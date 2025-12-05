module.exports = function override(config, env) {
  // Fix webpack-dev-server deprecation warnings
  if (config.devServer) {
    delete config.devServer.onBeforeSetupMiddleware;
    delete config.devServer.onAfterSetupMiddleware;
    
    // Use the new setupMiddlewares option
    config.devServer.setupMiddlewares = (middlewares, devServer) => {
      return middlewares;
    };
  }
  
  return config;
};
