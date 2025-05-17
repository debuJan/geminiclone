import React, { useContext } from "react";
import { Context } from "./Context";

const Settings = ({ onClose }) => {
  const { theme, toggleTheme } = useContext(Context);

  const handleCheckboxChange = () => {
    toggleTheme();
  };

  return (
    <div style={getModalStyles(theme)}>
      <h3>Settings</h3>
      <label>
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={handleCheckboxChange}
        />
        Dark Mode
      </label>
      <button onClick={onClose} style={closeBtnStyles}>Close</button>
    </div>
  );
};

const getModalStyles = (theme) => ({
  background: theme === "dark" ? "#1e1e1e" : "white",
  color: theme === "dark" ? "#f1f1f1" : "#000",
  padding: "1rem 2rem",
  borderRadius: "10px",
  boxShadow: "0 0 15px rgba(0,0,0,0.2)",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 1000,
});

const closeBtnStyles = {
  marginLeft: "10px",
};

export default Settings;
