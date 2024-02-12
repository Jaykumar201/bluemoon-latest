import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Header from './components/Header';
import Regiester from './components/Regiester';
import Context from './components/contextProvider/Context';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './components/Dashboard';
import Error from './components/Error';
import SendLink from './components/SendLink';
import Restpassword from './components/Restpassword';
import Otpverify from './components/Otpverify';

const router = createBrowserRouter([
  {
    path: "/",
    element:<Login></Login>,
  },
  {
    path:'/register',
    element:<Regiester></Regiester>
  },
  {
    path:'/dashboard',
    element:<Dashboard></Dashboard>
  },
  {
    path:'/*',
    element:<Error></Error>
  },
  {
    path:'/header',
    element:<Header></Header>
  },
  {
    path:'/send',
    element:<SendLink></SendLink>
  },
  {
    path:'/forgotpassword/:id/:token',
    element:<Restpassword></Restpassword>
  },
  {
    path:'/verifyOtp/:id/:token',
    element:<Otpverify></Otpverify>
  }
]);


function App() {
  return (
    <div>
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
