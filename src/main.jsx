import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, theme, Switch } from "antd";
import App from "./App";

const applyThemeToBody = (isDarkMode) => {
  document.body.style.backgroundColor = isDarkMode ? "#1e1e1e" : "#ffffff"; // Dark or light background color
  document.body.style.color = isDarkMode ? "#ffffff" : "#000000"; // Light or dark text color
};

const Main = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    applyThemeToBody(isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div style={{ padding: "10px" }}>
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
      </div>
      <App />
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
