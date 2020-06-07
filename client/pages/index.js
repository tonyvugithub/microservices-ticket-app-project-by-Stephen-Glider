//LANDING PAGE aka Homepage
import Link from 'next/link';

//Get the property currentUser from props
const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

/** If in the Custom App Component has getInitialProps(), the getInitialProps() in
 * this Page Component will be bypassed and not executed */

//To define getInitialProps function if you need to pass some initial data to
//the page component, very similar to mapStateToProps function in redux,
//you also return an object with props
//Because we set the parameters in _app.js, now in getInitialProps of landing page we can receive 3 parameters
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
