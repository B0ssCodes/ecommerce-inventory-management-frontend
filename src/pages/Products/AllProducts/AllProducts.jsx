import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  Button,
  Space,
  Input,
  Pagination,
  Select,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import "./AllProducts.css"; // Import the CSS file
import DeleteProduct from "../../../components/modals/DeleteProduct";

const { Title } = Typography;
const { Option } = Select;
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
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      sorter: (a, b) => a.sku.localeCompare(b.sku),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      sorter: (a, b) => a.cost - b.cost,
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      sorter: (a, b) => a.category.name.localeCompare(b.category.name),
    },
    {
      title: "Image Count",
      dataIndex: "imageCount",
      key: "imageCount",
      sorter: (a, b) => a.imageCount - b.imageCount,
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
          <DeleteProduct productID={record.productID} />
        </Space>
      ),
    },
  ];

  const handleTableChange = (page, pageSize) => {
    setPageNumber(page);
    setPageSize(pageSize);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2} style={{ margin: 0, lineHeight: "32px" }}>
          Products
        </Title>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
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
            style={{ marginRight: "8px" }}
          >
            Search
          </Button>
          <Select
            defaultValue={10}
            style={{ width: 120 }}
            onChange={(value) => handleTableChange(1, value)}
          >
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
          </Select>
        </div>
      </div>

      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="productID"
          bordered
          className="custom-table"
          pagination={false}
          onChange={handleTableChange}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Button type="primary">
          <Link to="/create-product" style={{ color: "white" }}>
            Create Product
          </Link>
        </Button>
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={products.length}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
}

export default AllProducts;
