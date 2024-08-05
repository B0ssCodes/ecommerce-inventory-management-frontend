import React, { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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

const ValidateRoute = ({ children, requiredPermissions }) => {
  const [isValid, setIsValid] = useState(isTokenValid());
  const hasNotified = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isValid) {
      const storedPermissions =
        JSON.parse(localStorage.getItem("userPermissions")) || [];
      if (!storedPermissions.includes(requiredPermissions)) {
        notification.error({
          message: "Access Denied",
          description: "You cannot access this page.",
        });
        navigate(-1); // Navigate to the previous page
      }
    } else if (!hasNotified.current) {
      notification.error({
        message: "You are not logged in",
        description: "Please log in to access this page.",
      });
      hasNotified.current = true;
    }
  }, [isValid, requiredPermissions, navigate]);

  return isValid ? children : <Navigate to="/login" replace />;
};

export default ValidateRoute;
