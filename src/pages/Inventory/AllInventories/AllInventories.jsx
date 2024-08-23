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
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import { EditOutlined, EyeOutlined, DownOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import "./AllInventories.css"; // Import the CSS file

const { Title } = Typography;
const { Option } = Select;

function AllInventories() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [products, setProducts] = useState([]);
  const [itemCount, setItemCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [filters, setFilters] = useState([]);
  const navigate = useNavigate();
  const [name, setName] = useState(null);
  const [sku, setSku] = useState(null);
  const [minStockNum, setMinStockNum] = useState(0);
  const [quantityLessThan, setQuantityLessThan] = useState(null);
  const [quantityGreaterThan, setQuantityGreaterThan] = useState(null);
  const [unitCostLessThan, setUnitCostLessThan] = useState(null);
  const [unitCostGreaterThan, setUnitCostGreaterThan] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchInventories = async (payload) => {
    const url = `https://localhost:7200/api/inventory/get`;
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
        setProducts(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch inventories:", data);
        alert(data.message || "Failed to fetch inventories");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching inventories");
    }
  };

  useEffect(() => {
    setMinStockNum(localStorage.getItem("minStockNumber"));
  }, []);

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      search: searchText,
      sortBy: sortBy,
      sortOrder: sortOrder,
      filters: filters,
    };
    fetchInventories(payload);
  }, [pageNumber, pageSize, searchText, sortBy, sortOrder, filters]);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      sorter: true,
    },
    {
      title: "SKU",
      dataIndex: "productSKU",
      key: "productSKU",
      sorter: true,
    },
    {
      title: "Bin",
      dataIndex: "binName",
      key: "binName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: true,
      render: (text, record) => (
        <span
          style={{ color: record.quantity < minStockNum ? "red" : "inherit" }}
        >
          {record.quantity}
        </span>
      ),
    },
    {
      title: "Unit Cost",
      dataIndex: "productPrice",
      key: "productPrice",
      sorter: true,
      render: (text) => `$${text}`,
    },
    {
      title: "Total Cost",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${text}`,
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
    debouncedHandleFilterChange("productName", "LIKE", `%${e.target.value}%`);
  };

  const handleSkuChange = (e) => {
    setSku(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("productSKU", "LIKE", `%${e.target.value}%`);
  };

  const handleQuantityLessThanChange = (e) => {
    setQuantityLessThan(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("quantity", "<", e.target.value);
  };
  const handleQuantityGreaterThanChange = (e) => {
    setQuantityGreaterThan(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("quantity", ">", e.target.value);
  };

  const handleCostGreaterThanChange = (e) => {
    setUnitCostGreaterThan(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("price", ">", e.target.value);
  };

  const handleCostLessThanChange = (e) => {
    setUnitCostLessThan(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("price", "<", e.target.value);
  };

  const clearFilters = () => {
    setName(null);
    setSku(null);
    setQuantityLessThan(null);
    setQuantityGreaterThan(null);
    setUnitCostLessThan(null);
    setUnitCostGreaterThan(null);
    // Clear the filters in your filter logic
    setFilters(null);
  };
  const filterMenu = (
    <Menu>
      <Menu.Item>
        <Input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={handleNameChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Input
          type="text"
          placeholder="Product SKU"
          value={sku}
          onChange={handleSkuChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Input
          type="number"
          placeholder="Quantity Greater Than"
          value={quantityGreaterThan}
          onChange={handleQuantityGreaterThanChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Input
          type="number"
          placeholder="Quantity Less Than"
          value={quantityLessThan}
          onChange={handleQuantityLessThanChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Input
          type="number"
          placeholder="Cost Greater Than"
          value={unitCostGreaterThan}
          onChange={handleCostGreaterThanChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Input
          type="number"
          placeholder="Cost Less Than"
          value={unitCostLessThan}
          onChange={handleCostLessThanChange}
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
          Inventory
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
              placeholder="Search Inventories..."
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
          dataSource={products}
          rowKey="inventoryID"
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
        <Button
          type="primary"
          style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
        >
          <Link to="/transactions" style={{ color: "white" }}>
            Create a transaction
          </Link>
        </Button>
        <Button
          type="default"
          style={{
            backgroundColor: "#fa8c16",
            borderColor: "#fa8c16",
            marginLeft: 16,
          }}
        >
          <Link to="/low-inventories" style={{ color: "white" }}>
            Low Stock
          </Link>
        </Button>
        <Button
          type="default"
          style={{
            backgroundColor: "#f5222d",
            borderColor: "#f5222d",
            marginLeft: 16,
          }}
        >
          <Link to="/out-inventories" style={{ color: "white" }}>
            Out of Stock
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

export default AllInventories;
