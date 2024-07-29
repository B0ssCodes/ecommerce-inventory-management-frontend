import React from "react";
import { Typography } from "antd";
import RegisterForm from "../../components/forms/RegisterForm";

const { Title } = Typography;

function CreateProduct() {
  return (
    <div>
      <Title style={{ textAlign: "center" }}>Create a New User</Title>
      <RegisterForm returnRoute={"/users"} />
    </div>
  );
}

export default CreateProduct;
