import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "bootstrap-icons/font/bootstrap-icons.css";
import './index.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Root from './routes/Root';
import ErrorPage from './routes/ErrorPage';
import PlantListPage, {loader as plantListLoader} from './components/PlantListPage';
import PlantDetailsPage, {
  action as plantDetailsAction,
  loader as plantDetailsLoader
} from './components/PlantDetailsPage';
import LoginPage, {action as loginAction} from './components/LoginPage';
import RegisterPage, {action as registerAction} from './components/RegisterPage';
import {action as logoutAction} from './routes/Logout';
import UserManagement, {
  action as userManagementAction,
  loader as userManagementLoader,
} from './components/UserManagement';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <PlantListPage/>,
        loader: plantListLoader,
      },
      {
        path: 'plants/:id',
        element: <PlantDetailsPage/>,
        loader: plantDetailsLoader,
        action: plantDetailsAction
      },
      {
        path: 'login',
        element: <LoginPage/>,
        action: loginAction,
      },
      {
        path: 'register',
        element: <RegisterPage/>,
        action: registerAction,
      },
      {
        path: 'user-management',
        element: <UserManagement/>,
        loader: userManagementLoader,
        action: userManagementAction,
      },
      {
        path: 'logout',
        action: logoutAction,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <RouterProvider router={router}/>
    </React.StrictMode>,
);
