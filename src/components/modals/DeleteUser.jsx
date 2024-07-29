import React from "react";
import { Button, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function DeleteUser({ userID }) {
  const handleDelete = async () => {
    console.log("Deleting user with ID:", userID);
    try {
      const response = await fetch(
        `https://localhost:7200/api/user/delete/${userID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to delete user");
        alert(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while deleting the user");
    }
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      icon: <DeleteOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete();
      },
    });
  };

  return (
    <div>
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        onClick={showDeleteConfirm}
      ></Button>
    </div>
  );
}

export default DeleteUser;
