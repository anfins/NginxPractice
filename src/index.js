import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import SignUp from "./Pages/SignUp/SignUp";
import Homepage from "./Pages/Homepage/Homepage";
import Login from "./Pages/Login/Login";
import RequireAuth from "./Components/RequireAuth/RequireAuth";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { NotificationProvider } from "./Providers/NotificationProvider";
import { AuthProvider } from "./Providers/AuthProvider";
import Loading from "./Pages/Loading/Loading";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Loading />,
  },

  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/homepage",
    element: (
      <RequireAuth hasNav={false}>
        <Homepage />
      </RequireAuth>
    ),
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
