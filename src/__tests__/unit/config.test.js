'use strict';

const { loadConfig, clearCache } = require('../../config');
const { MyPOSConfigError } = require('../../core/errors');

describe('Config Loader', () => {
  beforeEach(() => {
    clearCache();
    // Clear environment variables (including environment-specific ones)
    const envVarsToClear = [
      'MYPOS_SID', 'MYPOS_CLIENT_NUMBER', 'MYPOS_PRIVATE_KEY',
      'MYPOS_SID_SANDBOX', 'MYPOS_CLIENT_NUMBER_SANDBOX', 'MYPOS_PRIVATE_KEY_SANDBOX',
      'MYPOS_SID_PRODUCTION', 'MYPOS_CLIENT_NUMBER_PRODUCTION', 'MYPOS_PRIVATE_KEY_PRODUCTION',
      'MYPOS_SID_DEMO', 'MYPOS_CLIENT_NUMBER_DEMO', 'MYPOS_PRIVATE_KEY_DEMO'
    ];
    envVarsToClear.forEach(key => delete process.env[key]);
  });
  
  test('should load config with all required fields', () => {
    const config = loadConfig(MOCK_CONFIG);
    
    expect(config.sid).toBe('000000000000010');
    expect(config.clientNumber).toBe('61938166610');
    expect(config.environment).toBe('sandbox');
    expect(config.currency).toBe('EUR');
  });
  
  test('should merge defaults with user config', () => {
    const config = loadConfig({
      ...MOCK_CONFIG,
      lang: undefined // Should use default
    });
    
    expect(config.lang).toBe('EN'); // Default value
    expect(config.version).toBe('1.4'); // Default value
  });
  
  test('should throw error when SID is missing', () => {
    const invalidConfig = { ...MOCK_CONFIG };
    delete invalidConfig.sid;
    
    expect(() => loadConfig(invalidConfig)).toThrow(MyPOSConfigError);
    expect(() => loadConfig(invalidConfig)).toThrow(/SID is required/);
  });
  
  test('should throw error when clientNumber is missing', () => {
    const invalidConfig = { ...MOCK_CONFIG };
    delete invalidConfig.clientNumber;
    
    expect(() => loadConfig(invalidConfig)).toThrow(MyPOSConfigError);
    expect(() => loadConfig(invalidConfig)).toThrow(/CLIENT_NUMBER is required/);
  });
  
  test('should throw error when privateKey is missing', () => {
    const invalidConfig = { ...MOCK_CONFIG };
    delete invalidConfig.privateKey;
    
    expect(() => loadConfig(invalidConfig)).toThrow(MyPOSConfigError);
    expect(() => loadConfig(invalidConfig)).toThrow(/PRIVATE_KEY is required/);
  });
  
  test('should validate environment values', () => {
    expect(() => loadConfig({
      ...MOCK_CONFIG,
      environment: 'invalid'
    })).toThrow(MyPOSConfigError);
  });
  
  test('should accept valid environments', () => {
    const environments = ['sandbox', 'production', 'demo'];
    
    environments.forEach(env => {
      const config = loadConfig({
        ...MOCK_CONFIG,
        environment: env
      });
      expect(config.environment).toBe(env);
    });
  });
  
  test('should cache config when no params provided', () => {
    // First call
    const config1 = loadConfig(MOCK_CONFIG);
    // Second call should return cached version
    const config2 = loadConfig();
    
    expect(config1).toBe(config2);
  });
  
  test('should clear cache correctly', () => {
    loadConfig(MOCK_CONFIG);
    clearCache();
    
    // After clearing cache, should throw error if no params provided
    expect(() => loadConfig()).toThrow(MyPOSConfigError);
  });
});

