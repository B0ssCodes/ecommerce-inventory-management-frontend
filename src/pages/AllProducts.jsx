import React, { useEffect, useState } from "react";
import { Typography, Table, Button } from "antd";
import { Link } from "react-router-dom";
import "./AllProducts.css"; // Import the CSS file

const { Title } = Typography;

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = "https://localhost:7200/api/product/get";
      const payload = {
        pagenumber: pageNumber,
        pagesize: pageSize,
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
          alert(data.message || "Failed to fetch products");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred while fetching products");
      }
    };

    fetchProducts();
  }, [pageNumber, pageSize]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
    },
    {
      title: "Image Count",
      dataIndex: "imageCount",
      key: "imageCount",
    },
  ];

  const handleTableChange = (pagination) => {
    setPageNumber(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div>
      <Title style={{ textAlign: "center" }}>All Products</Title>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="productID"
        bordered
        className="custom-table"
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          total: products.productCount, // You can set this to the total number of products
        }}
        onChange={handleTableChange}
      />
      <Button type="primary" style={{ marginTop: 16 }}>
        <Link to="/create-product" style={{ color: "white" }}>
          Create Product
        </Link>
      </Button>
    </div>
  );
}

export default AllProducts;
