import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

const CategoryAnalytics = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryFetchCount = localStorage.getItem("categoryFetchCount");
      const url = `https://localhost:7200/api/analytics/getCategory/${categoryFetchCount}`;
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
          setCategories(data.result);
        } else {
          console.error("Failed to fetch categories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <Row gutter={[16, 16]}>
        {categories.map((category) => (
          <Col key={category.categoryID} xs={24} sm={24} md={12} lg={8}>
            <Card
              title={<Title level={3}>{category.categoryName}</Title>}
              style={{ marginBottom: "16px" }}
            >
              <Text style={{ fontSize: "1.5em" }}>
                Products Sold: {category.productsSold}
              </Text>
              <br />
              <Text style={{ fontSize: "1.5em" }}>
                Stock Value: ${category.stockValue}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoryAnalytics;
