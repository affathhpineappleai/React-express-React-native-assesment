import React from "react";
import "./EmployeeCard.css";

export default function EmployeeCard({ employee, onEdit, onDelete }) {
  // Function to get the correct image URL based on the format stored in database
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    
    const baseUrl = "http://localhost:5000";
    
    // Handle different image URL formats that might be stored in the database
    if (imagePath.startsWith("/uploads")) {
      // Format: "/uploads/filename.jpg" - prepend base URL
      return `${baseUrl}${imagePath}`;
    } else if (imagePath.startsWith("uploads/")) {
      // Format: "uploads/filename.jpg" - prepend base URL with slash
      return `${baseUrl}/${imagePath}`;
    } else if (imagePath.includes("://")) {
      // Format: Full URL (like https://via.placeholder.com/150) - use as is
      return imagePath;
    } else {
      // Format: Just filename - construct full path
      return `${baseUrl}/uploads/${imagePath}`;
    }
  };

  // Get the formatted image URL
  const imageUrl = getImageUrl(employee.image_url);

  return (
    <div className="employee-card">
      <div className="employee-info">
        <h3>{employee.Full_name}</h3>
        <p>{employee.position}</p>
        <p>{employee.department}</p>
        <p>{employee.email}</p>

        <div className="employee-actions">
          <button className="edit-btn" onClick={() => onEdit(employee._id)}>
            Edit
          </button>
          <button className="delete-btn" onClick={() => onDelete(employee._id)}>
            Delete
          </button>
        </div>
      </div>

      <img
        src={imageUrl}
        alt={employee.Full_name}
        className="employee-photo"
        onError={(e) => {
          // If image fails to load, show placeholder
          e.target.src = "https://via.placeholder.com/150";
        }}
      />
    </div>
  );
}