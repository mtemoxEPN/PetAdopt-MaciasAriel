// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const nodeModules = ['stream', 'crypto', 'http', 'https', 'net', 'tls', 'fs', 'path', 'os', 'zlib'];
  if (nodeModules.includes(moduleName)) {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Banear el import dinámico con variable que rompe Hermes
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

config.resolver.blockList = [
  /node_modules\/@supabase\/realtime-js\/dist\/main\/lib\/util\.js/,
];

module.exports = config;