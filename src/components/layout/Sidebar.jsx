import React, { useState, useEffect } from "react";
import { Menu, Card } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  ShopOutlined,
  AppstoreOutlined,
  TagsOutlined,
  TransactionOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import Logout from "../modals/Logout";

const items = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: <Link to="/">Home</Link>,
  },
  {
    key: "sub1",
    icon: <AppstoreOutlined />,
    label: "Inventory",
    children: [
      {
        key: "/transactions",
        icon: <TransactionOutlined />,
        label: <Link to="/transactions">Transactions</Link>,
      },
    ],
  },
  {
    key: "sub2",
    icon: <ShopOutlined />,
    label: "Products",
    children: [
      {
        key: "/products",
        icon: <ShoppingCartOutlined />,
        label: <Link to="/products">Products</Link>,
      },
      {
        key: "/categories",
        icon: <TagsOutlined />,
        label: <Link to="/categories">Categories</Link>,
      },
    ],
  },
  {
    key: "sub3",
    icon: <UserOutlined />,
    label: "Management",
    children: [
      {
        key: "/users",
        icon: <TeamOutlined />,
        label: <Link to="/users">Users</Link>,
      },
      {
        key: "/user-roles",
        icon: <UsergroupAddOutlined />,
        label: <Link to="/user-roles">User Roles</Link>,
      },
      {
        key: "/vendors",
        icon: <SolutionOutlined />,
        label: <Link to="/vendors">Vendors</Link>,
      },
    ],
  },
];

const Sidebar = ({ children, isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  // Set open keys based on the current location to open the category (copilot)
  useEffect(() => {
    const path = location.pathname;
    const parentKey = items.find((item) =>
      item.children?.some((child) => child.key === path)
    )?.key;
    if (parentKey) {
      setOpenKeys([parentKey]);
    }
  }, [location.pathname]);

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
              selectedKeys={[location.pathname]}
              openKeys={openKeys}
              onOpenChange={(keys) => setOpenKeys(keys)}
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
