import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import EditProductForm from "../../../components/forms/EditProductForm";

const { Title } = Typography;
function EditProduct() {
  const location = useLocation();
  const { productID } = location.state;
  const navigate = useNavigate();

  const handleProductBinClick = () => {
    navigate("/product-to-bin", { state: { productID } });
  };
  return (
    <div>
      <Title style={{ textAlign: "center" }}>Edit Product</Title>
      <Button onClick={handleProductBinClick} style={{ margin: "1em" }}>
        Add Product To Bin
      </Button>
      <EditProductForm productID={productID} />
    </div>
  );
}

export default EditProduct;
