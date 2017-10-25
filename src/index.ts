import * as google from 'googleapis';
import { escape } from 'querystring';
import { v4 } from 'uuid';
import { GetConfigOption } from './get-config-option';
import { SetConfigOption } from './set-config-option';

const CONFIG_API_VERSION = 'v1beta1';

export class RuntimeConfiguration {
  private _authClient: any;
  private _projectId: string;

  constructor(private credentials?: any) {

  }

  async getConfig(option: GetConfigOption): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const auth = await this.getAuthlient();
      const configStore = google.runtimeconfig(CONFIG_API_VERSION);
      const request = {
        auth,
        name: `projects/${option.projectId}/configs/${option.configName}/variables/${option.variable}`
      };

      configStore.projects.configs.variables.get(request, (err, response) => {
        if (err) {
          if (err.code === 404)
            return resolve();

          return reject(err);
        }

        if (response.text)
          return resolve(response.text);

        const buffer = Buffer.from(response.value, 'base64');

        if (option.isJson)
          return resolve(JSON.parse(buffer.toString()));

        return resolve(buffer.toString());
      });
    });
  }

  async setConfig(option: SetConfigOption): Promise<any> {
    return this.getConfig(option)
      .then(value => {
        if (value)
          return this.updateConfig(option);

        return this.createConfig(option);
      });
  }

  async createConfig(option: SetConfigOption): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const auth = await this.getAuthlient();
      const configStore = google.runtimeconfig(CONFIG_API_VERSION);
      const request = {
        auth,
        parent: `projects/${option.projectId}/configs/${option.configName}`,
        requestId: v4(),
        resource: {
          name: `projects/${option.projectId}/configs/${option.configName}/variables/${option.variable}`,
          value: getConfigValue(option.value)
        }
      };

      configStore.projects.configs.variables.create(request, (err, response, incommingMessage) => {
        if (err)
          return reject(err);

        return resolve(response);
      });
    });
  }

  async updateConfig(option: SetConfigOption): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const auth = await this.getAuthlient();
      const configStore = google.runtimeconfig(CONFIG_API_VERSION);
      const request = {
        auth,
        name: `projects/${option.projectId}/configs/${option.configName}/variables/${option.variable}`,
        resource: {
          value: getConfigValue(option.value)
        }
      };

      configStore.projects.configs.variables.update(request, (err, response, incommingMessage) => {
        if (err)
          return reject(err);

        return resolve(response);
      });
    });
  }

  private async getAuthlient(): Promise<any> {
    if (this._authClient)
      return Promise.resolve(this._authClient);

    const self = this;

    return new Promise((resolve, reject) => {
      google.auth.getApplicationDefault((err, authClient, projectId) => {
        if (err)
          return reject(err);

        self._projectId = projectId;
        // The createScopedRequired method returns true when running on GAE or a local developer
        // machine. In that case, the desired scopes must be passed in manually. When the code is
        // running in GCE or a Managed VM, the scopes are pulled from the GCE metadata server.
        // See https://cloud.google.com/compute/docs/authentication for more information.
        if (authClient.createScopedRequired && authClient.createScopedRequired())
        // Scopes can be specified either as an array or as a single, space-delimited string.
          authClient = authClient.createScoped([
            'https://www.googleapis.com/auth/cloudruntimeconfig'
          ]);

        resolve(authClient);
      });
    });
  }
}

function getConfigValue(value: any): any {
  const s = JSON.stringify(value);
  const buffer = Buffer.from(s);

  return buffer.toString('base64');
}
