import React from "react";
import { Menu, Card, Button } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  ShopOutlined,
  AppstoreOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logout from "../modals/Logout";

const items = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: <Link to="/">Home</Link>,
  },
  {
    key: "2",
    icon: <AppstoreOutlined />,
    label: <Link to="/products">Products</Link>,
  },
  {
    key: "3",
    icon: <TagsOutlined />,
    label: <Link to="/categories">Categories</Link>,
  },
  {
    key: "4",
    icon: <UserOutlined />,
    label: <Link to="/users">Users</Link>,
  },
  {
    key: "5",
    icon: <ShopOutlined />,
    label: <Link to="/vendors">Vendors</Link>,
  },
];

const Sidebar = ({ children, isLoggedIn, setIsLoggedIn }) => {
  return (
    <div style={{ display: "flex", height: "90vh", marginTop: "1em" }}>
      <div
        style={{
          width: 256,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {isLoggedIn ? (
          <>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              style={{ flex: 1 }}
              items={items}
            />
            <Card style={{ height: "10vh" }}>
              <Logout setIsLoggedIn={setIsLoggedIn} />
            </Card>
          </>
        ) : (
          <></>
        )}
      </div>
      <div style={{ flex: 1, padding: "16px" }}>{children}</div>
    </div>
  );
};

export default Sidebar;
