import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { notification } from "antd";

const isTokenValid = () => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("tokenExpiry");

  if (!token || !expiry) {
    return false;
  }

  const expiryDate = new Date(expiry);
  const now = new Date();

  return now < expiryDate;
};

const ValidateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(isTokenValid());
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!isValid && !hasNotified.current) {
      notification.error({
        message: "You are not logged in",
        description: "Please log in to access this page.",
      });
      hasNotified.current = true;
    }
  }, [isValid]);

  return isValid ? children : <Navigate to="/login" replace />;
};

export default ValidateRoute;
