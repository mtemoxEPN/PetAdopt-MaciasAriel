const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Fix alias paths (tsconfig paths)
config.resolver.alias = {
  '@features': path.resolve(__dirname, 'src/features'),
  '@shared': path.resolve(__dirname, 'src/shared'),
};

// Fix módulos Node.js que no existen en React Native
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const nodeModules = [
    'stream', 'crypto', 'http', 'https', 'net',
    'tls', 'fs', 'path', 'os', 'zlib', 'events',
    'util', 'buffer', 'url', 'querystring',
    // Fix OpenTelemetry dynamic import que rompe Hermes
    '@opentelemetry/api',
    '@opentelemetry/core',
    '@opentelemetry/context-async-hooks',
    '@opentelemetry/sdk-trace-base',
  ];
  if (nodeModules.includes(moduleName)) {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;