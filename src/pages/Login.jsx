import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import { Typography, Alert, Button } from "antd";
const { Title } = Typography;

function Login() {
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(
    !!location.state?.successMessage
  );

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000); // Hide the message after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [showSuccessMessage]);

  return (
    <div>
      {showSuccessMessage && (
        <Alert
          message={location.state.successMessage}
          type="success"
          showIcon
        />
      )}
      <Title level={1} style={{ textAlign: "center" }}>
        Login
      </Title>

      <LoginForm />
    </div>
  );
}

export default Login;
