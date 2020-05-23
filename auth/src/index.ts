import mongoDBConnection from './startup/db';

import { app } from './app';

app.listen(3001, () => {
  console.log('Auth service listening on port 3000!!!!');
});

mongoDBConnection();
