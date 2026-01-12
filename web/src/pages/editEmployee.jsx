// Import useState and useEffect hooks from React
import { useState, useEffect } from "react";

// Import hooks from react-router-dom to read URL params and navigate
import { useParams, useNavigate } from "react-router-dom";

// Import API functions to fetch and update employee data
import { getEmployeeById, updateEmployee } from "../api/api";

// Import Loader component for loading states
import Loader from "../components/Loader";
// Import Toast component for notifications
import Toast from "../components/Toast";

// EditEmployee component
export default function EditEmployee() {
  // Extract employee id from URL (/employees/edit/:id)
  const { id } = useParams();

  // useNavigate hook to redirect programmatically
  const navigate = useNavigate();

  // State to store editable employee form fields
  const [formData, setFormData] = useState({
    Full_name: "", // Employee full name
    email: "", // Employee email
    position: "", // Job position
    department: "", // Department name
  });

  // State to store selected image file
  const [file, setFile] = useState(null);

  // State to store image preview URL
  const [preview, setPreview] = useState(null);

  // State to control loading indicator (fetching + submitting)
  const [loading, setLoading] = useState(true);

  // State for toast notifications
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // success, error, etc.
  });

  // Fetch employee data when component mounts or id changes
  useEffect(() => {
    // Async function to fetch employee by ID
    const fetchEmployee = async () => {
      try {
        // Call backend API to get employee data
        const data = await getEmployeeById(id);

        // Populate form fields with fetched employee data
        setFormData({
          Full_name: data.Full_name,
          email: data.email,
          position: data.position,
          department: data.department,
        });

        // If employee has an image, construct the full URL for preview
        if (data.image_url) {
          // Check if image_url already contains the full path or just a partial path
          const baseUrl = "http://localhost:5000";
          let imageUrl = data.image_url;
          
          // If image_url starts with /uploads, prepend base URL
          if (imageUrl.startsWith("/uploads")) {
            setPreview(`${baseUrl}${imageUrl}`);
          } 
          // If image_url starts with uploads/ (without slash), prepend base URL with slash
          else if (imageUrl.startsWith("uploads/")) {
            setPreview(`${baseUrl}/${imageUrl}`);
          }
          // If it's just a filename, construct full path
          else {
            setPreview(`${baseUrl}/uploads/${imageUrl}`);
          }
        }
      } catch (error) {
        // Log error if fetching fails
        console.error("Failed to fetch employee:", error);

        // Show error toast
        showToast("Failed to load employee data", "error");
      } finally {
        // Stop loading once fetch is complete
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchEmployee();
  }, [id]); // Re-run when id changes

  // Function to show toast notification
  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  // Function to hide toast notification
  const hideToast = () => {
    setToast({
      ...toast,
      show: false,
    });
  };

  // Handle text and select input changes
  const handleChange = (e) => {
    // Extract input name and value
    const { name, value } = e.target;

    // Update formData state dynamically
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    // Get selected file from input
    const selectedFile = e.target.files[0];

    // Store file in state
    setFile(selectedFile);

    // If a file is selected, generate preview
    if (selectedFile) {
      // Create FileReader instance
      const reader = new FileReader();

      // When file reading is complete, update preview
      reader.onloadend = () => setPreview(reader.result);

      // Read file as base64 URL
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    // Prevent page reload on submit
    e.preventDefault();

    // Enable loading state
    setLoading(true);

    try {
      // Create FormData object to send text + image
      const data = new FormData();

      // Append all form fields to FormData
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append image file only if selected
      if (file) {
        data.append("image_url", file);
      }

      // Call backend API to update employee
      await updateEmployee(id, data);

      // Show success toast instead of alert
      showToast("Employee updated successfully", "success");

      // Redirect back to employee list after toast is visible
      setTimeout(() => {
        navigate("/employees");
      }, 2000);
    } catch (error) {
      // Log error if update fails
      console.error("Failed to update employee:", error);

      // Show error toast instead of alert
      showToast("Failed to update employee", "error");
    } finally {
      // Disable loading state
      setLoading(false);
    }
  };

  // Show Loader component while fetching or submitting data
  if (loading) return <Loader message="Loading employee..." />;

  // Render edit employee form
  return (
    <>
      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={3000}
        />
      )}

      <form onSubmit={handleSubmit}>
        <h2>Edit Employee</h2>

        {/* Full Name Input */}
        <input
          type="text"
          name="Full_name"
          value={formData.Full_name}
          onChange={handleChange}
          placeholder="Full Name"
        />

        {/* Email Input */}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />

        {/* Position Input */}
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Position"
        />

        {/* Department Dropdown */}
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>

        {/* Image Upload */}
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {/* Image Preview */}
        {preview && <img src={preview} alt="Preview" width="100" />}

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Employee"}
        </button>
      </form>
    </>
  );
}