import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Row, Col, Modal, Pagination, Input, Button, Spin } from "antd";
import { debounce } from "lodash";
import CreateVendorForm from "../../../components/forms/CreateVendorForm";

function SelectVendor() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactionTypeID, setTransactionTypeID] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [itemCount, setItemCount] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isVendorCreated, setIsVendorCreated] = useState(false);

  useEffect(() => {
    setTransactionTypeID(location.state.transactionTypeID);
  }, [location.state.transactionTypeID]);

  const fetchVendors = async (payload) => {
    setIsLoading(true);
    const url = "https://localhost:7200/api/vendor/get";
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
        setVendors(data.result);
        setItemCount(data.itemCount);
      } else {
        console.error("Failed to fetch vendors:", data);
        alert(data.message || "Failed to fetch vendors");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while fetching vendors");
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

    fetchVendors(payload);
  }, [pageNumber, pageSize, searchText]);

  useEffect(() => {
    if (isVendorCreated) {
      const payload = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        search: searchText,
      };

      fetchVendors(payload);
      setIsVendorCreated(false);
    }
  }, [isVendorCreated, pageNumber, pageSize, searchText]);

  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    setIsSelectModalOpen(true);
  };

  const handleSelectModalClose = () => {
    setIsSelectModalOpen(false);
  };

  const handleRegisterModalClose = () => {
    setIsRegisterModalOpen(false);
  };

  const handleSelectVendor = async (confirm) => {
    if (confirm) {
      const url = "https://localhost:7200/api/transaction/create";
      const token = localStorage.getItem("token");
      const payload = {
        transactionTypeID: parseInt(transactionTypeID),
        vendorID: parseInt(selectedVendor.vendorID),
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
    setSelectedVendor(null);
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
            placeholder="Search Vendors..."
            style={{ marginRight: "8px", maxWidth: "50%" }}
          />
          {isLoading && <Spin style={{ marginLeft: "8px" }} />}
        </div>
        <Button type="primary" onClick={() => setIsRegisterModalOpen(true)}>
          Create Vendor
        </Button>
      </div>
      {isLoading ? (
        <div></div>
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            {vendors.map((vendor) => (
              <Col span={8} key={vendor.vendorID}>
                <Card
                  title={vendor.name}
                  bordered={true}
                  onClick={() => handleVendorClick(vendor)}
                  style={{ cursor: "pointer" }}
                >
                  <p>{vendor.email}</p>
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
        title="Select Vendor"
        open={isSelectModalOpen}
        onOk={() => handleSelectVendor(true)}
        onCancel={handleSelectModalClose}
        okText="Yes"
        cancelText="No"
      >
        <p>Do you want to select this vendor?</p>
      </Modal>
      <Modal
        title="Add a Vendor"
        open={isRegisterModalOpen}
        onCancel={handleRegisterModalClose}
        footer={null}
      >
        <CreateVendorForm
          returnRoute={"stay"}
          buttonText="Create Vendor"
          showLogin={false}
          isRegisterModalOpen={isRegisterModalOpen}
          setIsRegisterModalOpen={setIsRegisterModalOpen}
          setIsVendorCreated={setIsVendorCreated}
        />
      </Modal>
    </div>
  );
}

export default SelectVendor;
