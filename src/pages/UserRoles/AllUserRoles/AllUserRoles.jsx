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
import "./AllUserRoles.css"; // Import the CSS file
import DeleteUserRole from "../../../components/modals/DeleteUserRole";

const { Title } = Typography;
const { Option } = Select;

function AllUserRoles() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [itemCount, setItemCount] = useState(1);
  const [userRoles, setUserRoles] = useState([]);
  const navigate = useNavigate();

  const fetchUserRoles = async (payload) => {
    const url = "https://localhost:7200/api/userRole/get";
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
        setUserRoles(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch user roles:", data);
        alert(data.message || "Failed to fetch user roles");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching user roles");
    }
  };

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchUserRoles(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleSearchClick = () => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchUserRoles(payload);
  };

  const handleEdit = (userRoleID) => {
    navigate("/edit-user-role", { state: { userRoleID } });
  };

  const handleSearch = (e) => {
    setPageNumber(1);
    setSearchText(e.target.value);
  };

  const columns = [
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.userRoleID)}
          ></Button>
          <DeleteUserRole userRoleID={record.userRoleID} />
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
        <Title level={2} style={{ marginBottom: "0.3em", lineHeight: "32px" }}>
          User Roles
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
            placeholder="Search user roles..."
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
          dataSource={userRoles}
          rowKey="userRoleID"
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
          <Link to="/create-user-role" style={{ color: "white" }}>
            Create User Role
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

export default AllUserRoles;
