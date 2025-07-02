import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import SignUp from "./Pages/SignUp";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";

import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { NotificationProvider } from "./Providers/NotificationProvider";
import { AuthProvider } from "./Providers/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/homepage",
    element: <Homepage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </NotificationProvider>
  </React.StrictMode>
);

reportWebVitals();
