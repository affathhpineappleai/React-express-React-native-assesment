// src/components/Loader.jsx
import React from "react";
import "../components/Loader.css"; // optional: for custom styling

// Loader component accepts optional props: size, color, message
export default function Loader({ size = "50px", color = "#007bff", message = "Loading..." }) {
  return (
    <div className="loader-container">
      <div
        className="spinner"
        style={{
          width: size,
          height: size,
          borderTopColor: color,
          borderRightColor: color,
        }}
      ></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
}
