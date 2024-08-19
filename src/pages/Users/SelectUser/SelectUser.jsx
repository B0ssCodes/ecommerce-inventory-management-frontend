import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Row, Col, Modal, Pagination, Input } from "antd";

function SelectUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactionTypeID, setTransactionTypeID] = useState(null);
  const [Users, setUsers] = useState([]);
  const [itemCount, setItemCount] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTransactionTypeID(location.state.transactionTypeID);
  }, [location.state.transactionTypeID]);

  useEffect(() => {
    const fetchUsers = async (payload) => {
      console.log(payload.search);
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
      }
    };

    const payload = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      search: searchText,
    };

    fetchUsers(payload);
  }, [pageNumber, pageSize, searchText]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
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
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSearch = (e) => {
    setPageNumber(1);
    setSearchText(e.target.value);
  };

  const handlePageChange = (page, pageSize) => {
    setPageNumber(page);
    setPageSize(pageSize);
  };

  return (
    <div>
      <Input
        type="text"
        onChange={handleSearch}
        placeholder="Search Users..."
        style={{ marginRight: "8px", maxWidth: "50%" }}
      />
      <Row gutter={[16, 16]}>
        {Users.map((user) => (
          <Col span={8} key={user.userID}>
            <Card
              title={user.name}
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
      <Modal
        title="Select User"
        open={isModalOpen}
        onOk={() => handleSelectUser(true)}
        onCancel={() => handleSelectUser(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Do you want to select this user?</p>
      </Modal>
    </div>
  );
}

export default SelectUser;
