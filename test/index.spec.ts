import { RuntimeConfiguration } from '../src';

describe('gcf-runtime-configuration', () => {
  it('should run', async () => {
    try {
      const config = new RuntimeConfiguration();
      const value = await config.getConfig('DAIKIN-CONFIG', 'CONNECTION-STRING2', 'daikin-001');

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  });
});
