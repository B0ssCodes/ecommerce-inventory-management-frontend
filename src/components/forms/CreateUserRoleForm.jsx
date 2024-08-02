import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

function CreateUserRoleForm() {
  const navigate = useNavigate();
  const handleFormSubmit = async (values) => {
    const url = "https://localhost:7200/api/userRole/create";
    const token = localStorage.getItem("token");
    const payload = {
      roleName: values.roleName,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        message.success("User role added successfully");
        navigate("/user-roles");
      } else {
        const error = data.message || "An unknown error occurred";
        console.error("Failed to add Category:", error);
        message.error(error);
      }
    } catch (error) {
      console.error("Error adding user role:", error);
      message.error("Error adding user role");
    }
  };

  return (
    <div>
      <Form
        name="addUserRole"
        initialValues={{ remember: true }}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          label="Role Name"
          name="roleName"
          rules={[{ required: true, message: "Please input the Role Name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Role
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateUserRoleForm;
