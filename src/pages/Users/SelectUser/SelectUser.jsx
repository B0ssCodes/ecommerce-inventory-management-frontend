import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Row, Col, Modal, Pagination, Input, Button, Spin } from "antd";
import { debounce } from "lodash";
import Register from "../../../components/forms/RegisterForm";

function SelectUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactionTypeID, setTransactionTypeID] = useState(null);
  const [users, setUsers] = useState([]);
  const [itemCount, setItemCount] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);

  useEffect(() => {
    setTransactionTypeID(location.state.transactionTypeID);
  }, [location.state.transactionTypeID]);

  const fetchUsers = async (payload) => {
    setIsLoading(true);
    const url = "https://localhost:7200/api/user/get/true";
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
        setUsers(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch users:", data);
        alert(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const payload = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      search: searchText,
    };

    fetchUsers(payload);
  }, [pageNumber, pageSize, searchText]);

  useEffect(() => {
    if (isUserCreated) {
      const payload = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        search: searchText,
      };

      fetchUsers(payload);
      setIsUserCreated(false);
    }
  }, [isUserCreated, pageNumber, pageSize, searchText]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsSelectModalOpen(true);
  };

  const handleSelectModalClose = () => {
    setIsSelectModalOpen(false);
  };

  const handleRegisterModalClose = () => {
    setIsRegisterModalOpen(false);
  };

  const handleSelectUser = async (confirm) => {
    if (confirm) {
      const url = "https://localhost:7200/api/transaction/create";
      const token = localStorage.getItem("token");
      const payload = {
        transactionTypeID: parseInt(transactionTypeID),
        vendorID: parseInt(selectedUser.userID),
      };

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
          navigate("/submit-transaction", {
            state: {
              transactionID: data.result,
              transactionTypeID: transactionTypeID,
            },
          });
        } else {
          console.error("Failed to create transaction:", data);
          alert(data.message || "Failed to create transaction");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred while creating transaction");
      }
    }
    setIsSelectModalOpen(false);
    setSelectedUser(null);
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setIsLoading(false);
    }, 1500),
    []
  );

  const handleSearch = (event) => {
    setIsLoading(true);
    debouncedSearch(event.target.value);
  };

  const handlePageChange = (page, pageSize) => {
    setPageNumber(page);
    setPageSize(pageSize);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Input
            type="text"
            onChange={handleSearch}
            placeholder="Search Users..."
            style={{ marginRight: "8px", maxWidth: "50%" }}
          />
          {isLoading && <Spin style={{ marginLeft: "8px" }} />}
        </div>
        <Button type="primary" onClick={() => setIsRegisterModalOpen(true)}>
          Create User
        </Button>
      </div>
      {isLoading ? (
        <div></div>
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            {users.map((user) => (
              <Col span={8} key={user.userID}>
                <Card
                  title={user.firstName + " " + user.lastName}
                  bordered={true}
                  onClick={() => handleUserClick(user)}
                  style={{ cursor: "pointer" }}
                >
                  <p>{user.email}</p>
                </Card>
              </Col>
            ))}
          </Row>
          <Pagination
            current={pageNumber}
            pageSize={pageSize}
            total={itemCount}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
            style={{ marginTop: 16, textAlign: "center" }}
          />
        </>
      )}
      <Modal
        title="Select User"
        open={isSelectModalOpen}
        onOk={() => handleSelectUser(true)}
        onCancel={handleSelectModalClose}
        okText="Yes"
        cancelText="No"
      >
        <p>Do you want to select this user?</p>
      </Modal>
      <Modal
        title="Add a User"
        open={isRegisterModalOpen}
        onCancel={handleRegisterModalClose}
        footer={null}
      >
        <Register
          returnRoute={"stay"}
          buttonText="Create User"
          showLogin={false}
          isRegisterModalOpen={isRegisterModalOpen}
          setIsRegisterModalOpen={setIsRegisterModalOpen}
          setIsUserCreated={setIsUserCreated}
        />
      </Modal>
    </div>
  );
}

export default SelectUser;
