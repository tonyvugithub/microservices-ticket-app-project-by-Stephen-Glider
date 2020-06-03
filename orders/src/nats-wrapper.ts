/**This class is used to create a client for NATS to pass to publishers and listeners */

import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  // _client? Tell TS that _client might be undefined for a period of time
  private _client?: Stan;

  //TS getter function, will throw an Error if access _client when it is undefined
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      //Call the client getter instead of accessing directly the _client attribute
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
