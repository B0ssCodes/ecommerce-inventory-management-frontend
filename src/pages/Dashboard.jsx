// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { decodeToken } from "../components/utility/decodeToken";
import { Button } from "antd";

function Dashboard() {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace with your actual JWT token
    const claims = decodeToken(token);
    console.log(claims); // Log the claims to inspect the structure
    if (
      claims &&
      claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
    ) {
      setFirstName(
        claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      );
    }
  }, []);

  return (
    <div>
      <h1>Welcome, {firstName}</h1>
      <Button>
        <Link to="/products">All Products</Link>
      </Button>
    </div>
  );
}

export default Dashboard;
