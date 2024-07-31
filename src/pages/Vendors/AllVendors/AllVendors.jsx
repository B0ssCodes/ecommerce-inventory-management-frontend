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
  const navigate = useNavigate();

  const fetchVendors = async (payload) => {
    const url = "https://localhost:7200/api/vendor/get";

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
        setVendors(data.result);
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
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Commercial",
      dataIndex: "commercialPhone",
      key: "commercialPhone",
      sorter: (a, b) => a.commercialPhone.localeCompare(b.commercialPhone),
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
            onChange={(e) => setSearchText(e.target.value)}
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
          total={vendors.length}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
}

export default AllVendors;
