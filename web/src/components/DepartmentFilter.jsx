// DepartmentFilter.jsx
import React from "react";
import "./DepartmentFilter.css";

export default function DepartmentFilter({ departments, selectedDepartment, onSelect }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      {departments.map((dept) => (
        <button
          key={dept}
          onClick={() => onSelect(dept)}
          style={{
            marginRight: "8px",
            padding: "6px 12px",
            borderRadius: "16px",
            backgroundColor: selectedDepartment === dept ? "#007bff" : "#eee",
            color: selectedDepartment === dept ? "#fff" : "#000",
            border: "none",
            cursor: "pointer",
          }}
        >
          {dept}
        </button>
      ))}
    </div>
  );
}
