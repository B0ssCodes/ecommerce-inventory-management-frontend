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
import { useNavigate } from "react-router-dom";
import { EyeOutlined, DownOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import moment from "moment";
import "./AllTransactions.css";
import CreateTransactionButton from "../../../components/modals/CreateTransactionButton";
import { decodeToken } from "../../../components/utility/decodeToken";
import DeleteTransaction from "../../../components/modals/DeleteTransaction";

const { Title } = Typography;
const { Option } = Select;

function AllTransactions() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [transactions, setTransactions] = useState([]);
  const [itemCount, setItemCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [filters, setFilters] = useState([]);
  const navigate = useNavigate();
  const [claims, setClaims] = useState(null);
  const [passedEmail, setPassedEmail] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [amountGreaterThan, setAmountGreaterThan] = useState("");
  const [amountLessThan, setAmountLessThan] = useState("");
  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState("");
  const [dateBefore, setDateBefore] = useState(null);
  const [dateAfter, setDateAfter] = useState(null);
  const dropdownRef = useRef(null);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedClaims = decodeToken(token);
      setClaims(decodedClaims);
      const roleName = decodedClaims["RoleName"];
      const userEmail =
        decodedClaims[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ];
      if (roleName === "Vendor" || roleName === "vendor") {
        setPassedEmail(userEmail);
      }
    }
  }, []);

  const fetchTransactions = async (payload) => {
    const url = "https://localhost:7200/api/transaction/get";
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vendorEmail: passedEmail,
          paginationParams: payload,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTransactions(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch transactions:", data);
        alert(data.message || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching transactions");
    }
  };

  useEffect(() => {
    if (claims) {
      const payload = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        search: searchText,
        sortBy: sortBy,
        sortOrder: sortOrder,
        filters: filters,
      };

      fetchTransactions(payload);
    }
  }, [pageNumber, pageSize, searchText, sortBy, sortOrder, filters, claims]);

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: true,
      render: (text) => `$${text}`,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: true,
      render: (text) => {
        if (text === "inbound") {
          return <span style={{ color: "green" }}>Inbound</span>; // Green text for inbound
        } else if (text === "outbound") {
          return <span style={{ color: "red" }}>Outbound</span>; // Red text for outbound
        }
        return text;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      render: (text) => capitalizeFirstLetter(text),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: true,
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) =>
        record.status === "created" ? (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() =>
                navigate("/submit-transaction", {
                  state: {
                    transactionID: record.transactionID,
                    transactionTypeID: record.typeID,
                  },
                })
              }
            >
              Submit
            </Button>
            <DeleteTransaction transactionID={record.transactionID} />
          </Space>
        ) : (
          <Button
            type="primary"
            onClick={() =>
              navigate("/view-transaction", {
                state: {
                  transactionID: record.transactionID,
                  transactionTypeID: record.typeID,
                },
              })
            }
          >
            <EyeOutlined />
          </Button>
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

  const handleAmountGreaterThanChange = (e) => {
    setAmountGreaterThan(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("amount", ">", e.target.value);
  };

  const handleAmountLessThanChange = (e) => {
    setAmountLessThan(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("amount", "<", e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsLoading(true);
    debouncedHandleFilterChange("email", "LIKE", `%${e.target.value}%`);
  };

  const clearFilters = () => {
    setAmountGreaterThan("");
    setAmountLessThan("");
    setType(null);
    setStatus(null);
    setEmail("");
    setDateBefore(null);
    setDateAfter(null);
    // Clear the filters in your filter logic
    setFilters(null);
  };
  const filterMenu = (
    <Menu>
      <Menu.Item>
        <Input
          type="number"
          placeholder="Amount Greater Than"
          value={amountGreaterThan}
          onChange={handleAmountGreaterThanChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Input
          type="number"
          placeholder="Amount Less Than"
          value={amountLessThan}
          onChange={handleAmountLessThanChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Select
          placeholder="Type Equals"
          value={type}
          onChange={(value) => {
            setType(value);
            handleFilterChange("type", "=", value);
          }}
          style={{ width: "100%" }}
        >
          <Option value="inbound">Inbound</Option>
          <Option value="outbound">Outbound</Option>
        </Select>
      </Menu.Item>
      <Menu.Item>
        <Select
          placeholder="Status Equals"
          value={status}
          onChange={(value) => {
            setStatus(value);
            handleFilterChange("status", "=", value);
          }}
          style={{ width: "100%" }}
        >
          <Option value="created">Created</Option>
          <Option value="submitted">Submitted</Option>
        </Select>
      </Menu.Item>
      <Menu.Item>
        <Input
          placeholder="Email Equals"
          value={email}
          onChange={handleEmailChange}
        />
      </Menu.Item>
      <Menu.Item>
        <DatePicker
          placeholder="Date After"
          value={dateAfter}
          onChange={(date, dateString) => {
            setDateAfter(date);
            handleFilterChange("date", ">", dateString);
          }}
        />
      </Menu.Item>
      <Menu.Item>
        <DatePicker
          placeholder="Date Before"
          value={dateBefore}
          onChange={(date, dateString) => {
            setDateBefore(date);
            handleFilterChange("date", "<", dateString);
          }}
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
          Transactions
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
          dataSource={transactions}
          rowKey="transactionID"
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
        <CreateTransactionButton />
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

export default AllTransactions;
