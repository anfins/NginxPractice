import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Loader from "../../Components/Loader/Loader";
import { useAuth } from "../../Providers/AuthProvider";
import { firestore } from "../../Services/Firebase";

const Loading = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const { state } = useLocation();

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }

    if (!auth.user) {
      navigate("/SignUp");
      return;
    } else {
      navigate("/Homepage");
    }
  }, [
    auth,
    navigate,
    auth.isLoading,
    firestore.userData?.id,
    firestore.userData?.role,
    firestore?.state,
    firestore.NO_USER_DOC,
    firestore.LOADED_USER_DOC,
    state?.previousPage,
  ]);

  return <Loader />;
};

export default Loading;
