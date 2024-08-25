import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { decodeToken } from "../components/utility/decodeToken";
import { Card, Typography, Row, Col, Button, Tag, Space } from "antd";

const { Title, Text } = Typography;

function Dashboard() {
  const [firstName, setFirstName] = useState("");
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outStockCount, setOutStockCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace with your actual JWT token
    const claims = decodeToken(token);
    console.log(claims); // Log the claims to inspect the structure
    if (
      claims &&
      claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
    ) {
      setFirstName(
        claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      );
    }

    const minStockNumber = localStorage.getItem("minStockNumber");

    const fetchLowStockCount = async () => {
      const response = await fetch(
        `https://localhost:7200/api/inventory/getlowCount/${minStockNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setLowStockCount(data.result);
    };

    const fetchOutStockCount = async () => {
      const response = await fetch(
        `https://localhost:7200/api/inventory/getoutCount`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setOutStockCount(data.result);
    };

    fetchLowStockCount();
    fetchOutStockCount();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Welcome, {firstName}</Title>
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col span={8}>
          <Card title="Inventory Management" bordered={true}>
            <Space direction="vertical" size="middle">
              <Text style={{ fontSize: "16px" }}>
                Keep track of your inventory.
              </Text>
              <Button type="primary">
                <Link to="/inventories">View Inventory</Link>
              </Button>
            </Space>
          </Card>
        </Col>
        {lowStockCount > 0 && (
          <Col span={8}>
            <Card title="Low Stock Inventories" bordered={true}>
              <Space direction="vertical" size="middle">
                <Tag color="orange" style={{ fontSize: "16px" }}>
                  Low Stock: {lowStockCount}
                </Tag>
                <Button type="primary" danger>
                  <Link to="/low-inventories">View Low Stock Inventory</Link>
                </Button>
              </Space>
            </Card>
          </Col>
        )}
        {outStockCount > 0 && (
          <Col span={8}>
            <Card title="Out of Stock Inventories" bordered={true}>
              <Space direction="vertical" size="middle">
                <Tag color="red" style={{ fontSize: "16px" }}>
                  Out of Stock: {outStockCount}
                </Tag>
                <Button type="primary" danger>
                  <Link to="/out-inventories">View Out of Stock Inventory</Link>
                </Button>
              </Space>
            </Card>
          </Col>
        )}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col span={8}>
          <Card title="Manage Products" bordered={true}>
            <Space direction="vertical" size="middle">
              <Text style={{ fontSize: "16px" }}>
                Add, edit, or remove products.
              </Text>
              <Button type="primary">
                <Link to="/products">Manage Products</Link>
              </Button>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Check Out Your Analytics"
            bordered={true}
            style={{
              border: "2px solid #1890ff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Space direction="vertical" size="middle">
              <Text style={{ fontSize: "16px" }}>
                Get detailed insights into your inventory and sales performance.
              </Text>
              <Button type="primary">
                <Link to="/all-analytics">View Analytics</Link>
              </Button>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Review and Create Transactions" bordered={true}>
            <Space direction="vertical" size="middle">
              <Text style={{ fontSize: "16px" }}>
                Review and create transactions.
              </Text>
              <Button type="primary">
                <Link to="/transactions">View Transactions</Link>
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col span={8}>
          <Card title="User Logs" bordered={true}>
            <Space direction="vertical" size="middle">
              <Text style={{ fontSize: "16px" }}>
                Check recent user activity logs.
              </Text>
              <Button type="primary">
                <Link to="/user-logs">View User Logs</Link>
              </Button>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="System Configuration" bordered={true}>
            <Space direction="vertical" size="middle">
              <Text style={{ fontSize: "16px" }}>
                Make the system your own.
              </Text>
              <Button type="primary">
                <Link to="/configuration">Configure System</Link>
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
