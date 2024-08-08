import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Layout } from "antd";

const { Title, Text } = Typography;
const { Content } = Layout;

const VendorAnalytics = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      const vendorFetchCount = localStorage.getItem("vendorFetchCount");
      const url = `https://localhost:7200/api/analytics/getVendor/${vendorFetchCount}`;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setVendors(data.result);
        } else {
          console.error("Failed to fetch vendors:", data.message);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  return (
    <Content style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Vendor Analytics
      </Title>
      <Row gutter={[16, 16]}>
        {vendors.map((vendor) => (
          <Col key={vendor.vendorID} xs={24} sm={24} md={12} lg={8}>
            <Card
              title={<Title level={3}>{vendor.vendorName}</Title>}
              style={{ marginBottom: "16px" }}
            >
              <Row>
                <Col span={24} style={{ textAlign: "center" }}>
                  <Text style={{ fontSize: "1.5em" }}>
                    Quantity: {vendor.productsSold}
                  </Text>
                </Col>
                <Col
                  span={24}
                  style={{ textAlign: "center", marginTop: "10px" }}
                >
                  <Text style={{ fontSize: "1.5em" }}>
                    Stock Price: ${vendor.stockValue}
                  </Text>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Content>
  );
};

export default VendorAnalytics;
