// config-overrides.js

module.exports = function override(config, env) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      zlib: false,  // Disable zlib
      querystring: false,  // Disabling querystring
      path: false,
      crypto:false,
      stream: false,
      os: false,
      http: false,
      url: false,
      buffer: false,
      util: false,

    };
    return config;
  };
  