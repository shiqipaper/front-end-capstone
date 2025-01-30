import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Root from './routes/Root';
import ErrorPage from './routes/ErrorPage';
import PlantListPage, { loader as plantListLoader } from './components/PlantListPage';
import PlantDetailsPage, {
  loader as plantDetailsLoader,
  action as plantDetailsAction
} from './components/PlantDetailsPage';
import LoginPage, { action as loginAction } from './components/LoginPage';
import RegisterPage, { action as registerAction } from './components/RegisterPage';
import { action as logoutAction } from './routes/Logout';
import UserManagement, {
  loader as userManagementLoader,
  action as userManagementAction,
} from './components/UserManagement';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <PlantListPage />,
        loader: plantListLoader,
      },
      {
        path: 'plants/:id',
        element: <PlantDetailsPage />,
        loader: plantDetailsLoader,
        action: plantDetailsAction
      },
      {
        path: 'login',
        element: <LoginPage />,
        action: loginAction,
      },
      {
        path: 'register',
        element: <RegisterPage />,
        action: registerAction,
      },
      {
        path: 'user-management',
        element: <UserManagement />,
        loader: userManagementLoader,
        action: userManagementAction,
      },
        {
        path: 'logout',
        action: logoutAction, // attach the logout action
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
