import React, { useState } from "react";
import { Button, Modal } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

function DeleteVendor({ vendorID }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setIsErrorModalOpen(true);
  };

  const handleDelete = async () => {
    console.log("Deleting vendor with ID:", vendorID);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7200/api/vendor/delete/${vendorID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to delete vendor");
        showErrorModal(result.message || "Failed to delete vendor");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      showErrorModal("An error occurred while deleting the vendor");
    }
  };

  const showDeleteConfirm = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    handleDelete();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleErrorModalOk = () => {
    setIsErrorModalOpen(false);
  };

  const handleErrorModalCancel = () => {
    setIsErrorModalOpen(false);
  };

  return (
    <div>
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        onClick={showDeleteConfirm}
      ></Button>
      <Modal
        title="Are you sure you want to delete this vendor?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        okType="danger"
        cancelText="No"
      >
        <div>
          <p>This action cannot be undone.</p>
        </div>
      </Modal>
      <Modal
        title={
          <span>
            <ExclamationCircleOutlined
              style={{ color: "red", marginRight: 8 }}
            />
            Error
          </span>
        }
        open={isErrorModalOpen}
        onOk={handleErrorModalOk}
        onCancel={handleErrorModalCancel}
        okText="OK"
      >
        <p>{errorMessage}</p>
      </Modal>
    </div>
  );
}

export default DeleteVendor;
