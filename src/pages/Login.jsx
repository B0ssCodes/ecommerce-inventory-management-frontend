import React from "react";
import LoginForm from "../components/forms/LoginForm";
import { Typography } from "antd";
const { Title } = Typography;

function Login() {
  return (
    <div>
      <Title level={1} style={{ textAlign: "center" }}>
        Login
      </Title>{" "}
      <LoginForm />
    </div>
  );
}

export default Login;
