import React, { useEffect, useState } from "react";
import { Typography, Table, Button, Space, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import "./AllProducts.css"; // Import the CSS file
import DeleteProduct from "../../../components/modals/DeleteProduct";

const { Title } = Typography;

function AllProducts() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async (payload) => {
    const url = "https://localhost:7200/api/product/get";

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

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchProducts(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleSearchClick = () => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchProducts(payload);
  };

  const handleEdit = (productID) => {
    navigate("/edit-product", { state: { productID } });
  };

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
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.productID)}
          ></Button>
          <DeleteProduct productID={products.productID} />
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPageNumber(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {" "}
        <Input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search products..."
          style={{ marginRight: "8px", maxWidth: "40%" }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearchClick}
        >
          Search
        </Button>
      </div>

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
          total: products.length,
        }}
        onChange={handleTableChange}
      />
      <Button type="primary" style={{ marginTop: 16 }}>
        <Link to="/create-product" style={{ color: "white" }}>
          Create Product
        </Link>
      </Button>
    </>
  );
}

export default AllProducts;
