import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Settings from "./Config.tsx";
import {Records, RecordsText} from "./Records.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "/settings",
        element: <Settings/>,
    },
    {
        path: "/records",
        element: <Records/>,
    },
    {
        path: "/records-text",
        element: <RecordsText/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
