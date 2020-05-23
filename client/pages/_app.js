import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

//The idea is to move the getInitialProps to wrapper AppComponent and pass it down to the
//custom page Component (ie:index, signup, signin, etc.)
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  //appContext.ctx is because it is in the Custom App Component instead of Page Component
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};
  //Check if the Custom Component has getInitialProps function
  if (appContext.Component.getInitialProps) {
    //Execute the getInitialProps of the Custom Component through Component.getInitialProps()
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  //data is {currentUser: ... }
  //Props of App Component
  return {
    pageProps,
    ...data,
  };
};
export default AppComponent;
