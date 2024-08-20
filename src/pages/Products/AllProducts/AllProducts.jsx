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
import "./AllProducts.css"; // Import the CSS file
import DeleteProduct from "../../../components/modals/DeleteProduct";

const { Title } = Typography;
const { Option } = Select;

function AllProducts() {
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
  const [description, setDescription] = useState(null);
  const [priceLessThan, setPriceLessThan] = useState(null);
  const [priceGreaterThan, setPriceGreaterThan] = useState(null);
  const [costLessThan, setCostLessThan] = useState(null);
  const [costGreaterThan, setCostGreaterThan] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchProducts = async (payload) => {
    const url = `https://localhost:7200/api/product/get`;
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
        console.error("Failed to fetch products:", data);
        alert(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching products");
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
    fetchProducts(payload);
  }, [pageNumber, pageSize, searchText, sortBy, sortOrder, filters]);

  const handleView = (productID) => {
    navigate("/view-product/" + productID);
  };

  const handleEdit = (productID) => {
    navigate("/edit-product", { state: { productID } });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      sorter: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: true,
      render: (text) => `$${text}`,
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      sorter: true,
      render: (text) => `$${text}`,
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
    },
    {
      title: "Image Count",
      dataIndex: "imageCount",
      key: "imageCount",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.productID)}
          ></Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.productID)}
          ></Button>
          <DeleteProduct productID={record.productID} />
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

  const handleSkuChange = (e) => {
    setSku(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("sku", "LIKE", `%${e.target.value}%`);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("description", "LIKE", `%${e.target.value}%`);
  };

  const handleCostGreaterThanChange = (e) => {
    setCostGreaterThan(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("cost", ">", e.target.value);
  };

  const handleCostLessThanChange = (e) => {
    setCostLessThan(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("cost", "<", e.target.value);
  };
  const handlePriceGreaterThanChange = (e) => {
    setPriceGreaterThan(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("price", ">", e.target.value);
  };

  const handlePriceLessThanChange = (e) => {
    setPriceLessThan(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("price", "<", e.target.value);
  };

  const clearFilters = () => {
    setName(null);
    setSku(null);
    setDescription(null);
    setCostLessThan(null);
    setCostGreaterThan(null);
    setPriceLessThan(null);
    setPriceGreaterThan(null);
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
          type="text"
          placeholder="Product Description"
          value={description}
          onChange={handleDescriptionChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Input
          type="number"
          placeholder="Cost Greater Than"
          value={costGreaterThan}
          onChange={handleCostGreaterThanChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Input
          type="number"
          placeholder="Cost Less Than"
          value={costLessThan}
          onChange={handleCostLessThanChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Input
          type="number"
          placeholder="Price Greater Than"
          value={priceGreaterThan}
          onChange={handlePriceGreaterThanChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Input
          type="number"
          placeholder="Price Less Than"
          value={priceLessThan}
          onChange={handlePriceLessThanChange}
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
          Products
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
          dataSource={products}
          rowKey="productID"
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
          <Link to="/create-product" style={{ color: "white" }}>
            Create Product
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

export default AllProducts;
