// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const NODE_MODULES_TO_BLOCK = [
  'stream', 'crypto', 'http', 'https', 'net', 'tls',
  'fs', 'path', 'os', 'zlib', 'events', 'buffer',
  'string_decoder', 'assert', 'util', 'vm', 'constants', 'domain',
  'ws'
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (NODE_MODULES_TO_BLOCK.includes(moduleName)) {
    return { type: 'empty' };
  }
  // Bloquear el archivo específico de supabase que tiene el dynamic import con variable
  if (
    moduleName.includes('@opentelemetry') ||
    moduleName.includes('opentelemetry')
  ) {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.blockList = [
  /node_modules\/@supabase\/realtime-js\/dist\/main\/lib\/util\.js/,
];

module.exports = config;