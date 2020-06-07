//To create an instance of stripe and export to where we need stripe in our project

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2020-03-02',
});
