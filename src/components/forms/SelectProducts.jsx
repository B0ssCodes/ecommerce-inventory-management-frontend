import React, { useEffect, useState } from "react";
import { Card, Row, Col, Modal, Input, Button, Pagination } from "antd";

function SelectProducts({
  transactionItems,
  setTransactionItems,
  itemsToSubmit,
  setItemsToSubmit,
}) {
  const [products, setProducts] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async (payload) => {
      const url = "https://localhost:7200/api/product/get";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        setProducts(data.result);
        setItemCount(data.itemCount);
      } else {
        alert("Failed to fetch Products:", data.message);
      }
    };
    const payload = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      search: searchText,
    };
    fetchData(payload);
  }, [pageNumber, pageSize, searchText]);

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (selectedProduct && quantity > 0) {
      const newTransactionItem = {
        productID: selectedProduct.id,
        productName: selectedProduct.name,
        productSKU: selectedProduct.sku,
        quantity: quantity,
        price: selectedProduct.cost * quantity,
      };

      setTransactionItems([...transactionItems, newTransactionItem]);

      const newItemToSubmit = {
        productID: selectedProduct.productID,
        quantity: quantity,
        price: selectedProduct.cost * quantity,
      };

      setItemsToSubmit([...itemsToSubmit, newItemToSubmit]);
    }
    setIsModalVisible(false);
    setQuantity(0);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setQuantity(0);
  };

  const handleSearchChange = (e) => {
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
        placeholder="Search products"
        value={searchText}
        onChange={handleSearchChange}
        style={{ marginBottom: 16 }}
      />
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col span={8} key={product.productID}>
            <Card
              title={product.name}
              bordered={true}
              onClick={() => showModal(product)}
              style={{ cursor: "pointer" }}
            >
              <p>SKU: {product.sku}</p>
              <p>Cost: ${product.cost}</p>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={pageNumber}
        pageSize={pageSize}
        total={itemCount}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: "center" }}
      />
      <Modal
        title="Enter Quantity"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Enter quantity"
        />
      </Modal>
    </div>
  );
}

export default SelectProducts;
