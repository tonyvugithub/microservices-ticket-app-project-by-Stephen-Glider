import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

//The idea is to move the getInitialProps to wrapper AppComponent and pass it down to the
//custom page Component (ie:index, signup, signin, etc.)
//The AppComponent is similar to Layout Component
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  //appContext.ctx is because it is in the Custom App Component instead of Page Component
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  //Has to be exactly named pageProps to make it work
  let pageProps = {};
  //Check if the Custom Component has getInitialProps function
  if (appContext.Component.getInitialProps) {
    //Execute the getInitialProps of the Custom Component through Component.getInitialProps()
    //Because it won't execute automatically
    pageProps = await appContext.Component.getInitialProps(
      //This is the way to pass parameter to getInitialProps of Custom Component
      //Check index.ts to understand better
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  //data is {currentUser: ... }
  //Props of App Component
  return {
    pageProps,
    ...data,
  };
};
export default AppComponent;
