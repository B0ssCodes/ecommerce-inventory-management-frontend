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
import "./AllVendors.css"; // Import the CSS file
import DeleteVendor from "../../../components/modals/DeleteVendor";

const { Title } = Typography;
const { Option } = Select;

function AllVendors() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [vendors, setVendors] = useState([]);
  const [itemCount, setItemCount] = useState(1);
  const navigate = useNavigate();

  const fetchVendors = async (payload) => {
    const url = "https://localhost:7200/api/vendor/get";
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
        setVendors(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch vendors:", data);
        alert(data.message || "Failed to fetch vendors");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching vendors");
    }
  };

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchVendors(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleSearchClick = () => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchVendors(payload);
  };

  const handleEdit = (vendorID) => {
    navigate("/edit-vendor", { state: { vendorID } });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Commercial",
      dataIndex: "commercialPhone",
      key: "commercialPhone",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.vendorID)}
          ></Button>
          <DeleteVendor vendorID={record.vendorID} />
        </Space>
      ),
    },
  ];

  const handleTableChange = (page, pageSize) => {
    setPageNumber(page);
    setPageSize(pageSize);
  };

  const handleSearch = (e) => {
    setPageNumber(1);
    setSearchText(e.target.value);
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
          Vendors
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
            onChange={handleSearch}
            placeholder="Search vendors..."
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
          dataSource={vendors}
          rowKey="vendorID"
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
          <Link to="/create-vendor" style={{ color: "white" }}>
            Add Vendor
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

export default AllVendors;
