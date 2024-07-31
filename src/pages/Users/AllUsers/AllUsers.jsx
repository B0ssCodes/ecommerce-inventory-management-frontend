import React, { useEffect, useState } from "react";
import { Typography, Table, Button, Input, Pagination, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import "./AllUsers.css"; // Import the CSS file
import DeleteUser from "../../../components/modals/DeleteUser";

const { Title } = Typography;
const { Option } = Select;

function AllUsers() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async (payload) => {
    const url = "https://localhost:7200/api/user/get";

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
        setUsers(data.result);
      } else {
        console.error("Failed to fetch users:", data);
        alert(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching users");
    }
  };

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchUsers(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleSearchClick = () => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchUsers(payload);
  };

  const handleEdit = (userID) => {
    navigate("/edit-user", { state: { userID } });
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "First",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Last",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => <DeleteUser userID={record.userID} />,
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
          Users
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
            placeholder="Search users..."
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
          dataSource={users}
          rowKey="userID"
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
          <Link to="/create-user" style={{ color: "white" }}>
            Create User
          </Link>
        </Button>
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={users.length}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
}

export default AllUsers;
