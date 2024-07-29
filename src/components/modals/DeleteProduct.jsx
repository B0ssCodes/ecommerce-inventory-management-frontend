import React from "react";
import { Button, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function DeleteProduct({ productID }) {
  const handleDelete = async () => {
    console.log("Deleting product with ID:", productID);
    try {
      const response = await fetch(
        `https://localhost:7200/api/product/delete/${productID}`,
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
        console.error("Failed to delete product");
        alert(response.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while deleting the product");
    }
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
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

export default DeleteProduct;
