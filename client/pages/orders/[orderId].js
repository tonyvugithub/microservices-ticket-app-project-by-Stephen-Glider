import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeRemaining = () => {
      const msRemaining = new Date(order.expiresAt) - new Date();
      setTimeRemaining(Math.round(msRemaining / 1000));
    };
    //First invoke when component just mount
    findTimeRemaining();
    //Recall the function every second
    const timerId = setInterval(findTimeRemaining, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return timeRemaining < 0 ? (
    <div>Your order has expired</div>
  ) : (
    <div>
      Time left to pay: {timeRemaining} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51Gr2wPDErvtIgxWTrV6lOx45a5jXne8ifuoRMMrMAfm3G4FqNoP1CIaDdT795DWQ2okuZLWMPvWkp6tsOqoPwBHL00DsKNX882"
        //Stripe deal with cents hence * 100
        amount={order.ticket.price * 100}
        email={currentUser.email}
        currency="CAD"
        name="Ticketing Co."
      >
        <button className="btn btn-primary">Pay Now</button>
      </StripeCheckout>
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
