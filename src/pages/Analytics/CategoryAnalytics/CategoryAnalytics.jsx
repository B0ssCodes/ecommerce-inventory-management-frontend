import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import moment from "moment";

const { Title, Text } = Typography;

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFF",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
];

const CategoryAnalytics = ({ displayAll = null }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  let categoryFetchCount = localStorage.getItem("categoryFetchCount");

  useEffect(() => {
    const fetchCategories = async () => {
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

  const handleRefreshStatistics = async () => {
    const url = "https://localhost:7200/api/mv/refresh/category";
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
        window.location.reload();
      } else {
        console.error("Failed to refresh statistics:", data);
        alert(data.message || "Failed to refresh statistics");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while refreshing statistics");
    }
  };

  const pieData = categories.map((category) => ({
    name: category.categoryName,
    value: category.stockValue,
  }));

  const handleCardClick = () => {
    navigate("/category-analytics");
  };

  return (
    <div onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <Card
        hoverable={displayAll === false}
        style={{
          marginBottom: "20px",
          textAlign: "center",
          transition: "transform 0.3s",
          ...(displayAll === false && {
            ":hover": {
              transform: "scale(1.05)",
            },
          }),
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col
            span={12}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "left",
            }}
          >
            <Title level={2}>Most Sold Categories</Title>
            <Text>
              Here are the top {categoryFetchCount} categories with the highest
              sales.
            </Text>
            {categories.length > 0 && (
              <Text>
                Last updated:{" "}
                {moment(categories[0].lastUpdated).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}
              </Text>
            )}

            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleRefreshStatistics();
              }}
              style={{ marginTop: "10px", maxWidth: "30%" }}
            >
              Refresh Statistics
            </Button>
          </Col>
          <Col span={12}>
            <PieChart width={500} height={400}>
              <Pie
                data={pieData}
                cx={250}
                cy={200}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Col>
        </Row>
      </Card>
      {(displayAll === null || displayAll) && (
        <Row gutter={[16, 16]}>
          {categories.map((category) => (
            <Col key={category.categoryID} xs={24} sm={24} md={12} lg={8}>
              <Card
                hoverable
                onClick={() =>
                  navigate(`/view-category/${category.categoryID}`)
                }
                style={{
                  marginBottom: "16px",
                  transition: "transform 0.3s",
                  cursor: "pointer",
                }}
                bodyStyle={{ textAlign: "center" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                title={<Title level={3}>{category.categoryName}</Title>}
              >
                <Row>
                  <Col span={24} style={{ textAlign: "center" }}>
                    <Text style={{ fontSize: "1.5em" }}>
                      Products Sold: {category.productsSold}
                    </Text>
                  </Col>
                  <Col
                    span={24}
                    style={{ textAlign: "center", marginTop: "10px" }}
                  >
                    <Text style={{ fontSize: "1.5em" }}>
                      Stock Value: ${category.stockValue}
                    </Text>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CategoryAnalytics;
