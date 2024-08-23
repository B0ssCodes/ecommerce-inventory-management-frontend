import React, { useEffect, useState, useCallback } from "react";
import {
  Pagination,
  Typography,
  Table,
  Button,
  Space,
  Input,
  Select,
  Spin,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { EditOutlined } from "@ant-design/icons";
import "./AllWarehouses.css"; // Import the CSS file
import DeleteWarehouse from "../../../components/modals/DeleteWarehouse";

const { Title } = Typography;
const { Option } = Select;

function AllWarehouses() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [itemCount, setItemCount] = useState(1);
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchWarehouses = async (payload) => {
    const url = "https://localhost:7200/api/warehouse/get";
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
        setWarehouses(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch warehouses:", data);
        alert(data.message || "Failed to fetch warehouses");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching warehouses");
    }
  };

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchWarehouses(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleEdit = (warehouseID) => {
    navigate("/edit-warehouse", { state: { warehouseID } });
  };

  const handleTableChange = (page, pageSize) => {
    setPageNumber(page);
    setPageSize(pageSize);
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setIsLoading(false);
    }, 1500),
    []
  );

  const handleSearchChange = (e) => {
    setIsLoading(true);
    debouncedSearch(e.target.value);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "warehouseName",
      key: "warehouseName",
    },
    {
      title: "Address",
      dataIndex: "warehouseAddress",
      key: "warehouseAddress",
    },
    {
      title: "Floor Count",
      dataIndex: "floorCount",
      key: "floorCount",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.warehouseID)}
          ></Button>
          <DeleteWarehouse warehouseID={record.warehouseID} />
        </Space>
      ),
    },
  ];

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
          Warehouses
        </Title>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div>
            <Input
              type="text"
              onChange={handleSearchChange}
              placeholder="Search Warehouses..."
              style={{ marginRight: "8px", maxWidth: "80%" }}
            />
            {isLoading ? <Spin size="small" /> : null}
          </div>
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
          dataSource={warehouses}
          rowKey="warehouseID"
          bordered
          className="custom-table"
          pagination={false} // Disable built-in pagination, using pagination outside the table
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
          <Link to="/create-warehouse" style={{ color: "white" }}>
            Create Warehouse
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

export default AllWarehouses;
