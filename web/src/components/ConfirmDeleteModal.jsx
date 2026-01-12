import React from "react";

export default function ConfirmDeleteModal({ onConfirm, onCancel, message }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 8,
          maxWidth: 400,
          width: "90%",
          textAlign: "center",
        }}
      >
        <p style={{ marginBottom: 20 }}>
          {message || "Are you sure you want to delete this item?"}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 6,
              border: "none",
              backgroundColor: "#6c757d",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 6,
              border: "none",
              backgroundColor: "#dc3545",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
