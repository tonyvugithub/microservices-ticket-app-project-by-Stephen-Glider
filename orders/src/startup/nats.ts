import { natsWrapper } from '../nats-wrapper';
import { TicketCreatedListener } from '../events/listeners/TicketCreatedListener';
import { TicketUpdatedListener } from '../events/listeners/TicketUpdatedListener';

export default async () => {
  //The checks are to satisfy TS
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined!');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined!');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined!');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    //Listen for close event on client
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    //Graceful shutdown
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    //Listening for events sent to the orders service
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};
