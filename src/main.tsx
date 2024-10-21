import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import './index.css';
import Default from './components/mainContent/default/index.tsx';
import Favorites from './components/mainContent/favorites.tsx';
import Playlist from './components/mainContent/playlist.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Default />,
      },
      { path: '/favorites', element: <Favorites /> },
      { path: '/playlist/:playlistId', element: <Playlist /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
