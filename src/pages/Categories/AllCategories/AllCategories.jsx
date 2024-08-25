import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Typography,
  Table,
  Button,
  Space,
  Input,
  Pagination,
  Select,
  Spin,
  Dropdown,
  Menu,
  DatePicker,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import { EditOutlined, EyeOutlined, DownOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import moment from "moment";
import "./AllCategories.css"; // Import the CSS file
import DeleteCategory from "../../../components/modals/DeleteCategory";

const { Title } = Typography;
const { Option } = Select;

function AllCategories() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categories, setCategories] = useState([]);
  const [itemCount, setItemCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [filters, setFilters] = useState([]);
  const navigate = useNavigate();
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchCategories = async (payload) => {
    const url = `https://localhost:7200/api/category/get`;
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
        setCategories(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch categories:", data);
        alert(data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching categories");
    }
  };

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      search: searchText,
      sortBy: sortBy,
      sortOrder: sortOrder,
      filters: filters,
    };
    fetchCategories(payload);
  }, [pageNumber, pageSize, searchText, sortBy, sortOrder, filters]);

  const handleView = (categoryID) => {
    navigate(`/view-category/${categoryID}`);
  };

  const handleEdit = (categoryID) => {
    navigate("/edit-category", { state: { categoryID } });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.categoryID)}
          ></Button>
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

  const handleTableChange = (pagination, filters, sorter) => {
    // Handle sorting only (since pagination is managed externally)
    setSortBy(sorter.field);
    setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
  };

  const handlePaginationChange = (page, pageSize) => {
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

  const handleFilterChange = (field, operator, value) => {
    setFilters((prevFilters) => {
      const newFilters = prevFilters.filter(
        (filter) => !(filter.field === field && filter.operator === operator)
      );
      if (value) {
        newFilters.push({ field, operator, value });
      }
      return newFilters;
    });
  };

  const debouncedHandleFilterChange = useCallback(
    debounce((field, operator, value) => {
      handleFilterChange(field, operator, value);
      setIsLoading(false);
    }, 800),
    []
  );

  const handleNameChange = (e) => {
    setName(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("name", "LIKE", `%${e.target.value}%`);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("description", "LIKE", `%${e.target.value}%`);
  };

  const clearFilters = () => {
    setName(null);
    setDescription(null);
    // Clear the filters in your filter logic
    setFilters(null);
  };
  const filterMenu = (
    <Menu>
      <Menu.Item>
        <Input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={handleNameChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Input
          type="text"
          placeholder="Category Description"
          value={description}
          onChange={handleDescriptionChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Button onClick={clearFilters}>Clear Filters</Button>
      </Menu.Item>
    </Menu>
  );

  const handleDropdownVisibleChange = (flag) => {
    setIsDropdownOpen(flag);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2} style={{ marginBottom: "0.4em", lineHeight: "32px" }}>
          Categories
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
              placeholder="Search Transactions..."
              style={{ marginRight: "8px", maxWidth: "80%" }}
            />
            {isLoading ? <Spin size="small" /> : null}
          </div>

          <Select
            defaultValue={10}
            style={{ width: 120 }}
            onChange={(value) => handlePaginationChange(1, value)}
          >
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
          </Select>

          <Dropdown
            overlay={filterMenu}
            trigger={["click"]}
            open={isDropdownOpen}
            onVisibleChange={handleDropdownVisibleChange}
            ref={dropdownRef}
          >
            <Button style={{ marginLeft: 8 }}>
              Filter <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>

      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="categoryID"
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
          <Link to="/create-category" style={{ color: "white" }}>
            Create Category
          </Link>
        </Button>
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={itemCount}
          onChange={handlePaginationChange}
        />
      </div>
    </>
  );
}

export default AllCategories;
