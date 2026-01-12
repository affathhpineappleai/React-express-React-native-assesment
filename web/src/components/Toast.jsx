import React, { useEffect, useState } from "react";
import "../components/Toast.css";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  const [isExiting, setIsExiting] = useState(false);

  // Handle close with animation
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "✓";
    }
  };

  // Automatically close after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // Cleanup function when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup any remaining timeouts
    };
  }, []);

  return (
    <div className={`toast ${type} ${isExiting ? 'fade-out' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span>{message}</span>
      </div>
      <button className="toast-close" onClick={handleClose} aria-label="Close">
        &times;
      </button>
    </div>
  );
}