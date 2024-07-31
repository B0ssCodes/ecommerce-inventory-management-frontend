import { useState, useEffect } from "react";

const applyThemeToBody = (isDarkMode) => {
  document.body.style.backgroundColor = isDarkMode ? "#1e1e1e" : "#ffffff"; // Dark or light background color
  document.body.style.color = isDarkMode ? "#ffffff" : "#000000"; // Light or dark text color
};

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    applyThemeToBody(isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    localStorage.setItem("darkMode", isDarkMode ? "false" : "true");
  };

  return [isDarkMode, toggleTheme];
};

export default useDarkMode;
