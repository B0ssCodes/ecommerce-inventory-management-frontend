import React, { useEffect, useState } from "react";
import { Typography, Card, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = "https://localhost:7200/api/product/get";
      const payload = {
        pagenumber: 1,
        pagesize: 10,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {
          setProducts(data.result);
        } else {
          console.error("Failed to fetch products:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Title style={{ textAlign: "center" }}>All Products</Title>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col key={product.productID} span={8}>
            <Card title={product.Name} bordered={false}>
              <p>
                <strong>SKU:</strong> {product.SKU}
              </p>
              <p>
                <strong>Description:</strong> {product.Description}
              </p>
              <p>
                <strong>Price:</strong> ${product.Price}
              </p>
              <p>
                <strong>Cost:</strong> ${product.Cost}
              </p>
              <p>
                <strong>Category:</strong> {product.category.categoryname}
              </p>
              <p>
                <strong>Images:</strong>
              </p>
              <ul>
                {product.images.map((image, index) => (
                  <li key={index}>
                    <img
                      src={image}
                      alt={`Product ${product.productID} Image ${index + 1}`}
                      style={{ width: "100%" }}
                    />
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
        ))}
      </Row>
      <Button>
        <Link to="/create-product">Create Product</Link>
      </Button>
    </div>
  );
}

export default AllProducts;
