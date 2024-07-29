import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ValidateRoute from "./components/utility/ValidateRoute";
import AllProducts from "./pages/AllProducts/AllProducts";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct/EditProduct";

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
