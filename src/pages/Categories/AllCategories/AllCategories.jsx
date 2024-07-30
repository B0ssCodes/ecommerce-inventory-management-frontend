import React, { useEffect, useState } from "react";
import { Typography, Table, Button, Space, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import "./AllCategories.css"; // Import the CSS file
import DeleteCategory from "../../../components/modals/DeleteCategory";

const { Title } = Typography;

function AllCategories() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async (payload) => {
    const url = "https://localhost:7200/api/category/get";

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
        setCategories(data.result);
      } else {
        console.error("Failed to fetch Categories:", data);
        alert(data.message || "Failed to fetch Categories");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching Categories");
    }
  };

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchCategories(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleSearchClick = () => {
    const payload = {
      pageNumber: pageNumber,
      pagesize: pageSize,
      search: searchText,
    };

    fetchCategories(payload);
  };

  const handleEdit = (categoryID) => {
    navigate("/edit-category", { state: { categoryID } });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.categoryID)}
          ></Button>
          <DeleteCategory categoryID={record.categoryID} />
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
          placeholder="Search Categories..."
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

      <Title style={{ textAlign: "center" }}>All Categories</Title>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="categoryID"
        bordered
        className="custom-table"
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          total: categories.length > 0 || 0,
        }}
        onChange={handleTableChange}
      />
      <Button type="primary" style={{ marginTop: 16 }}>
        <Link to="/create-category" style={{ color: "white" }}>
          Create Category
        </Link>
      </Button>
    </>
  );
}

export default AllCategories;
