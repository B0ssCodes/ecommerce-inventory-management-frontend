import React, { useEffect, useState } from "react";
import { Typography, Table, Button, Space, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import "./AllVendors.css"; // Import the CSS file
import DeleteVendor from "../../../components/modals/DeleteVendor";

const { Title } = Typography;

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
          placeholder="Search vendors..."
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

      <Title style={{ textAlign: "center" }}>Vendors</Title>
      <Table
        columns={columns}
        dataSource={vendors}
        rowKey="vendorID"
        bordered
        className="custom-table"
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          total: vendors.length > 0 || 0,
        }}
        onChange={handleTableChange}
      />
      <Button type="primary" style={{ marginTop: 16 }}>
        <Link to="/create-vendor" style={{ color: "white" }}>
          Add Vendor
        </Link>
      </Button>
    </>
  );
}

export default AllVendors;
