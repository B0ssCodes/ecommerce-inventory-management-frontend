import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
function App() {
  return (
    <Router>
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
