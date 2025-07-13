import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../Providers/AuthProvider";
import SideNav from "../SideNav/SideNav";

/**
 * Checks if a user has a user object in the db
 * If not, it returns them to the previous page (sign up)
 * If they do, it renders the SideNav component, which renders the rest of the page's content
 */

// smallerNav being true will render a smaller SideNav component
const RequireAuth = ({ hasNav = true, children, smallerNav }) => {
  const auth = useAuth();

  console.log(auth)

  if (!auth.user) {
    return (
      <Navigate
        to="/"
        state={{
          previousPage: window.location.pathname,
        }}
      />
    );
  }

  return hasNav ? <SideNav compact={smallerNav}>{children}</SideNav> : children;
};

export default RequireAuth;
