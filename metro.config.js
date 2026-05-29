const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@features': path.resolve(__dirname, 'src/features'),
  '@shared': path.resolve(__dirname, 'src/shared'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const blocked = [
    'stream', 'crypto', 'http', 'https', 'net', 'tls', 'fs',
    'path', 'os', 'zlib', 'events', 'util', 'buffer', 'url',
    'querystring', '@opentelemetry/api', '@opentelemetry/core',
    '@opentelemetry/context-async-hooks', '@opentelemetry/sdk-trace-base',
  ];
  if (blocked.includes(moduleName)) {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Esto es lo que faltaba — transformar el dynamic import a algo que Hermes entiende
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

config.resolver.unstable_enablePackageExports = true;

module.exports = config;