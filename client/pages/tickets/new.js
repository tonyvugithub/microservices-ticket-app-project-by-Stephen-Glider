import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });
  //This event handler to automatically format user input for price
  const onBlurHandler = () => {
    const value = parseFloat(price);
    //If the value entered is not a number than return early
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            onBlur={onBlurHandler}
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
