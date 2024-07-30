import React from "react";
import { Button, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function DeleteCategory({ categoryID }) {
  const handleDelete = async () => {
    console.log("Deleting category with ID:", categoryID);
    try {
      const response = await fetch(
        `https://localhost:7200/api/category/delete/${categoryID}`,
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
        console.error("Failed to delete category");
        alert(response.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while deleting the category");
    }
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      icon: <DeleteOutlined />,
      content: (
        <div>
          <p style={{ color: "red", fontSize: "18px", fontWeight: "bold" }}>
            Deleting this category will remove ALL products related to it
          </p>
          <p>This action cannot be undone.</p>
        </div>
      ),
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

export default DeleteCategory;
