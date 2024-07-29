import React, { useEffect, useState } from "react";
import { Typography, Table, Button, Space, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import "./AllUsers.css"; // Import the CSS file
import DeleteProduct from "../../components/modals/DeleteProduct";
import DeleteUser from "../../components/modals/DeleteUser";

const { Title } = Typography;

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
      pagenumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchUsers(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleSearchClick = () => {
    const payload = {
      pagenumber: pageNumber,
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
    },
    {
      title: "First",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => <DeleteUser userID={record.userID} />,
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
          placeholder="Search users..."
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

      <Title style={{ textAlign: "center" }}>All users</Title>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="userID"
        bordered
        className="custom-table"
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          total: users.userCount, // Assuming users is an array
        }}
        onChange={handleTableChange}
      />
      <Button type="primary" style={{ marginTop: 16 }}>
        <Link to="/create-user" style={{ color: "white" }}>
          Create User
        </Link>
      </Button>
    </>
  );
}

export default AllUsers;
