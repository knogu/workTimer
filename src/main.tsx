import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Settings from "./Config.tsx";
import {TimerPage} from "./App.tsx";
import {RecoilRoot} from "recoil";

const router = createBrowserRouter([
    {
        path: "/",
        element: <TimerPage/>,
    },
    {
        path: "/settings",
        element: <Settings/>,
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RecoilRoot>
          <RouterProvider router={router} />
      </RecoilRoot>
  </React.StrictMode>,
)
