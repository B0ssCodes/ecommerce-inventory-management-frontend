import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

const EditUserRoleForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRoleID } = location.state || {};
  const [form] = Form.useForm();
  useEffect(() => {
    const fetchUserRoleDetails = async () => {
      try {
        const url = `https://localhost:7200/api/userRole/get/${userRoleID}`;
        const token = localStorage.getItem("token");
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        form.setFieldsValue(data.result);
      } catch (error) {
        console.error("Failed to fetch user role details:", error);
      }
    };

    if (userRoleID) {
      fetchUserRoleDetails();
    }
  }, [userRoleID, form]);

  const handleSubmit = async (values) => {
    const payload = {
      roleName: values.role,
    };
    try {
      const url = `https://localhost:7200/api/userRole/update/${userRoleID}`;
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.success("User role updated successfully");
        navigate("/user-roles");
      } else {
        message.error("Failed to update user role");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      message.error("An error occurred while updating the user role");
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="role"
        label="Role Name"
        rules={[{ required: true, message: "Please enter the Role Name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Edit Role
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditUserRoleForm;
