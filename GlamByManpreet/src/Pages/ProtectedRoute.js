import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, session, isAllowed, redirectTo }) => {
  if (!session) {
    // Redirect if there is no session (not logged in)
    return <Navigate to={redirectTo} />;
  }

  if (!isAllowed) {
    // Redirect if the user is not allowed to access this route
    return <Navigate to={redirectTo} />;
  }

  // Render the protected component if all checks pass
  return <Component />;
};

export default ProtectedRoute;
