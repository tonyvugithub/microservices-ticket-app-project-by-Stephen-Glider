//LANDING PAGE aka Homepage
import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

/** If in the Custom App Component has getInitialProps(), the getInitialProps() in
 * this Page Component will be bypassed and not executed */

//To define getInitialProps function if you need to pass some initial data to
//the page component, very similar to mapStateToProps function in redux,
//you also return an object with props
LandingPage.getInitialProps = async (context) => {
  //First argunment of getInitalProps is context which include properties such as req
  //that has the headers property
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
  // data is either {currentUser: {...} } or { currentUser: null }
};

export default LandingPage;
