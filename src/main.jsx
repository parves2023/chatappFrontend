import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Chat from './Chat'; // you can extract chat UI from App into this component
import GlobalChat from './pages/GlobalChat.jsx';
import Home from './pages/Home.jsx'; // Home component for global chat
import CreateGroup from './pages/CreateGroup.jsx'; // Placeholder for Create Group page
import JoinGroup from './pages/JoinGroup.jsx';


import { Provider } from 'react-redux'
import { store } from '../app/store.js';
import JoinedGroup from './components/JoinedGroup.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Login/Register page
  },
  {
    path: '/chat',
    element: <Chat />, // Chat component after login
  },
  {
    path: '/global',
    element: <GlobalChat />, // Global chat component
  },
    {
    path: '/home',
    element: <Home />, // Global chat component
  },
  {
    path: 'create-group',
    element: <CreateGroup />, // Placeholder for Create Group page
  },
  {
    path: 'join-group',
    element: <JoinGroup />, // Placeholder for Join Group page
  },
  {
    path: 'Join-group/:groupId',
    element: <JoinedGroup />, // Placeholder for Join Group page with groupId
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={store}>
    <RouterProvider router={router} />
     </Provider>
  </StrictMode>
);
