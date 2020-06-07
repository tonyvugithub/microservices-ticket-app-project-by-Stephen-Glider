import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/ExpirationCompletePublisher';
import { natsWrapper } from '../nats-wrapper';

//Payload will show the datatype of job data
interface PayLoad {
  orderId: string;
}

//Create a Queue object to release jobs to and receive jobs from Redis server
export const expirationQueue = new Queue<PayLoad>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

//What the Queue would do after job processed by Redis and received by Queue
expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});
