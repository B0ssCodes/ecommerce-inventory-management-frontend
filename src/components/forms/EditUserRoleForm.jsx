import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Row, Col, Checkbox } from "antd";
import {
  CheckOutlined,
  AppstoreOutlined,
  TransactionOutlined,
  ShopOutlined,
  TagsOutlined,
  UserOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  SettingOutlined,
  PieChartOutlined,
  DotChartOutlined,
  AreaChartOutlined,
  LineChartOutlined,
  BankOutlined,
} from "@ant-design/icons";

const EditUserRoleForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRoleID } = location.state || {};
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [canPurchase, setCanPurchase] = useState(false);

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

        const receivedPermissions = data.result.permissions.map(
          (p) => p.permission
        );
        setSelectedPermissions(receivedPermissions);
        setCanPurchase(data.result.canPurchase);
      } catch (error) {
        console.error("Failed to fetch user role details:", error);
      }
    };

    if (userRoleID) {
      fetchUserRoleDetails();
    }
  }, [userRoleID, form]);

  const handlePermissionClick = (permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((item) => item !== permission)
        : [...prev, permission]
    );
  };

  const handleSubmit = async (values) => {
    const payload = {
      roleName: values.role,
      canPurchase,
      permissions: selectedPermissions,
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

  const permissions = [
    { name: "Dashboard", icon: <HomeOutlined /> },
    { name: "Inventory", icon: <AppstoreOutlined /> },
    { name: "Transactions", icon: <TransactionOutlined /> },
    { name: "Products", icon: <ShopOutlined /> },
    { name: "Categories", icon: <TagsOutlined /> },
    { name: "Users", icon: <UserOutlined /> },
    { name: "User Roles", icon: <UsergroupAddOutlined /> },
    { name: "Vendors", icon: <SolutionOutlined /> },
    { name: "Warehouses", icon: <BankOutlined /> },
    { name: "All Analytics", icon: <LineChartOutlined /> },
    { name: "Product Analytics", icon: <PieChartOutlined /> },
    { name: "Category Analytics", icon: <DotChartOutlined /> },
    { name: "Vendor Analytics", icon: <AreaChartOutlined /> },
    { name: "User Logs", icon: <AreaChartOutlined /> },
    { name: "Configuration", icon: <SettingOutlined /> },
  ];

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="role"
        label="Role Name"
        rules={[{ required: true, message: "Please enter the Role Name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Permissions">
        <Row gutter={[16, 16]}>
          {permissions.map((permission) => (
            <Col span={6} key={permission.name}>
              <Button
                type={
                  selectedPermissions.includes(permission.name)
                    ? "primary"
                    : "default"
                }
                icon={
                  selectedPermissions.includes(permission.name) ? (
                    <CheckOutlined />
                  ) : (
                    permission.icon
                  )
                }
                onClick={() => handlePermissionClick(permission.name)}
                size="large"
                style={{ width: "100%" }}
              >
                {permission.name}
              </Button>
            </Col>
          ))}
        </Row>
      </Form.Item>
      <Form.Item>
        <Checkbox
          checked={canPurchase}
          onChange={(e) => setCanPurchase(e.target.checked)}
        >
          Can Purchase Items
        </Checkbox>
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
