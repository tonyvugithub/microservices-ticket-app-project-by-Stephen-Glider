import mongoDBConnection from './startup/db';
import natsConnection from './startup/nats';

import { app } from './app';

app.listen(3003, () => {
  console.log('Tickets service listening on port 3004');
});

natsConnection(); //Connect to NATS Streaming Server
mongoDBConnection(); //Connect to MongoDB
