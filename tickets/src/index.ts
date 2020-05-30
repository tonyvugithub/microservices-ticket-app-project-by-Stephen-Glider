import mongoDBConnection from './startup/db';

import { app } from './app';

app.listen(3004, () => {
  console.log('Tickets service listening on port 3004');
});

mongoDBConnection();
