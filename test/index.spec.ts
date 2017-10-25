import { RuntimeConfiguration } from '../src';

describe('gcf-runtime-configuration', () => {

  it.skip('Should create json variable', async () => {
    try {
      const config = new RuntimeConfiguration();
      const value = await config.createConfig({
        configName: 'DAIKIN-CONFIG',
        variable: 'CONFIG-v2',
        projectId: 'daikin-001',
        value: {
          id: 1,
          name: 'test-config-name'
        }
      });

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  });

  it.skip('should get value', async () => {
    try {
      const config = new RuntimeConfiguration();
      const value = await config.getConfig({
        configName: 'DAIKIN-CONFIG',
        variable: 'CONFIG-v2',
        projectId: 'daikin-001',
        isJson: true
      });

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  });

  it.skip('Should update json variable', async () => {
    try {
      const config = new RuntimeConfiguration();
      const value = await config.updateConfig({
        configName: 'DAIKIN-CONFIG',
        variable: 'CONFIG-v1',
        projectId: 'daikin-001',
        value: {
          id: 1,
          name: 'test-config-name'
        }
      });

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  });

});
