import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ValidateRoute from "./components/utility/ValidateRoute";
import AllProducts from "./pages/Products/AllProducts/AllProducts";
import CreateProduct from "./pages/Products/CreateProduct/CreateProduct";
import EditProduct from "./pages/Products/EditProduct/EditProduct";
import AllUsers from "./pages/Users/AllUsers/AllUsers";
import CreateUser from "./pages/Users/CreateUser/CreateUser";
import AllVendors from "./pages/Vendors/AllVendors/AllVendors";
import CreateVendor from "./pages/Vendors/CreateVendor/CreateVendor";
import EditVendor from "./pages/Vendors/EditVendor/EditVendor";
import AllCategories from "./pages/Categories/AllCategories/AllCategories";
import CreateCategory from "./pages/Categories/CreateCategory/CreateCategory";
import EditCategory from "./pages/Categories/EditCategory/EditCategory";
import Sidebar from "./components/layout/Sidebar";
import AllTransactions from "./pages/Transactions/AllTransactions/AllTransactions";
import CreateTransaction from "./pages/Transactions/CreateTransaction/CreateTransaction";
import SelectVendor from "./pages/Vendors/SelectVendor/SelectVendor";
import SubmitTransaction from "./pages/Transactions/SubmitTransaction/SubmitTransaction";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (token && tokenExpiry) {
      const currentTime = new Date().getTime();
      if (currentTime > tokenExpiry) {
        // Token has expired, refresh the page to redirect to login
        window.location.reload();
      } else {
        setIsLoggedIn(true);
      }
    }
  }, []);
  return (
    <Router>
      <Sidebar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          <Route
            path="/"
            element={
              <ValidateRoute>
                <Dashboard />
              </ValidateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ValidateRoute>
                <AllProducts />
              </ValidateRoute>
            }
          />
          <Route
            path="/create-product"
            element={
              <ValidateRoute>
                <CreateProduct />
              </ValidateRoute>
            }
          />
          <Route
            path="/edit-product"
            element={
              <ValidateRoute>
                <EditProduct />
              </ValidateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ValidateRoute>
                <AllUsers />
              </ValidateRoute>
            }
          />

          <Route
            path="/create-user"
            element={
              <ValidateRoute>
                <CreateUser />
              </ValidateRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <ValidateRoute>
                <AllVendors />
              </ValidateRoute>
            }
          />
          <Route
            path="/create-vendor"
            element={
              <ValidateRoute>
                <CreateVendor />
              </ValidateRoute>
            }
          />
          <Route
            path="/edit-vendor"
            element={
              <ValidateRoute>
                <EditVendor />
              </ValidateRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ValidateRoute>
                <AllCategories />
              </ValidateRoute>
            }
          />
          <Route
            path="/create-category"
            element={
              <ValidateRoute>
                <CreateCategory />
              </ValidateRoute>
            }
          />
          <Route
            path="/edit-category"
            element={
              <ValidateRoute>
                <EditCategory />
              </ValidateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ValidateRoute>
                <AllTransactions />
              </ValidateRoute>
            }
          />
          <Route
            path="/create-transaction"
            element={
              <ValidateRoute>
                <CreateTransaction />
              </ValidateRoute>
            }
          />
          <Route
            path="/select-vendor"
            element={
              <ValidateRoute>
                <SelectVendor />
              </ValidateRoute>
            }
          />
          <Route
            path="/submit-transaction"
            element={
              <ValidateRoute>
                <SubmitTransaction />
              </ValidateRoute>
            }
          />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Sidebar>
    </Router>
  );
}

export default App;
