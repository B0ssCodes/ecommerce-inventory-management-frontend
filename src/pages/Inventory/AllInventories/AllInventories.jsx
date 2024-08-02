import React, { useEffect, useState } from "react";
import {
  Pagination,
  Typography,
  Table,
  Button,
  Space,
  Input,
  Select,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import "./AllInventories.css"; // Import the CSS file
import DeleteCategory from "../../../components/modals/DeleteCategory";

const { Title } = Typography;
const { Option } = Select;

function AllInventories() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [itemCount, setItemCount] = useState(1);
  const [inventories, setInventories] = useState([]);
  const navigate = useNavigate();

  const fetchInventories = async (payload) => {
    const url = "https://localhost:7200/api/inventory/get";
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setInventories(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch Inventories:", data);
        alert(data.message || "Failed to fetch Inventories");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching Inventories");
    }
  };

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchInventories(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleSearchClick = () => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchInventories(payload);
  };

  const handleSearch = (e) => {
    setPageNumber(1);
    setSearchText(e.target.value);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "SKU",
      dataIndex: "productSKU",
      key: "productSKU",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total Cost",
      dataIndex: "price",
      key: "price",
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
        <Title level={2} style={{ marginBottom: "0.3em", lineHeight: "32px" }}>
          Inventory
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
            onChange={handleSearch}
            placeholder="Search Inventories..."
            style={{ marginRight: "8px", maxWidth: "50%" }}
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
          dataSource={inventories}
          rowKey="inventoryID"
          bordered
          className="custom-table"
          pagination={false} // Disable built-in pagination
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
          <Link to="/transactions" style={{ color: "white" }}>
            Create a transaction
          </Link>
        </Button>
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={itemCount}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
}

export default AllInventories;
