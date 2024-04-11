import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Settings from "./Config.tsx";
import {Records} from "./Records.tsx";
import {TimerPage} from "./App.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <TimerPage/>,
    },
    {
        path: "/settings",
        element: <Settings/>,
    },
    {
        path: "/records",
        element: <Records/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
