//Helper to create a customized instance of axios depending on which environment (browser or server)
import axios from 'axios';

export default ({ req }) => {
  //Destructure req property from context
  if (typeof window === 'undefined') {
    //we are on the server because window is an object only exist on the browser
    //On the server make request to http://ingress-nginx.ingress-nginx.svc.cluster.local
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      /* Need to include this so ingress-nginx understand that you try to use ticketing.dev host 
        as in the rules or else it won't understand the domain of the request. In req.headers there 
        is host: 'ticketing.dev' and the 'cookie'. So basically you just passed along the header from 
        the original request as well*/
      headers: req.headers,
    });
  } else {
    //We are on the browser
    //Because this request is made from the browser, cookie was sent along with it to current-user route
    return axios.create({
      baseURL: '/',
    });
  }
};
