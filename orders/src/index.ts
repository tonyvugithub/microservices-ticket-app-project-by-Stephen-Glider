import mongoDBConnection from './startup/db';
import natsConnection from './startup/nats';

import { app } from './app';

app.listen(3002, () => {
  console.log('Orders service listening on port 3002');
});

natsConnection(); //Connect to NATS Streaming Server
mongoDBConnection(); //Connect to MongoDB
