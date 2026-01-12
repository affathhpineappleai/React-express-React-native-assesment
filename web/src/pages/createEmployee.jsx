import React from "react";
import { createEmployee } from "../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateEmployee.css"; //import CSS for CreateEmployee

// Import Loader for showing loading states
import Loader from "../components/Loader";
// Import Toast component
import Toast from "../components/Toast"; // Add this import

export default function CreateEmployee() {
  const navigate = useNavigate();
  
  //state for form data
  const [formData, setFormData] = useState({
    Full_name: "",
    email: "",
    position: "",
    department: "HR",
  });

  //state for file upload
  const [file, setFile] = useState(null);

  //state for image preview
  const [preview, setPreview] = useState(null);

  //state for  that shows the loading status of the form submission
  const [loading, setLoading] = useState(false);

  // Add state for toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" // default type
  });

  //function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //function to handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; //get the selected file from the input
    setFile(selectedFile); //set the file state

    //create a preview url
    if (selectedFile) {
      const reader = new FileReader(); //create a new file reader instance for reading the file to get a preview by using FileReader API
      reader.onloadend = () => {
        //when the file is read completely set the preview state with the result
        setPreview(reader.result); //set the preview state with the result
      };
      reader.readAsDataURL(selectedFile); //read the file as a data URL to generate a preview
    } else {
      setPreview(null); //if no file is selected clear the preview state
    }
  };

  // Function to show toast
  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type
    });
  };

  // Function to hide toast
  const hideToast = () => {
    setToast({
      ...toast,
      show: false
    });
  };

  //handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent default form submission behavior
    setLoading(true); //set loading state to true when the form submission starts

    try {
      const data = new FormData(); //create a new FormData object to hold the form data and file upload

      Object.keys(formData).forEach((key) => {
        //iterate over each key in the formData state object to append the key-value pairs to the formData object
        data.append(key, formData[key]); //append each key-value pair from the formData state to the FormData object
      });

      if (file) data.append("image_url", file); //append file if selected

      await createEmployee(data); //call the createEmployee function from the api module

      // Show success toast instead of alert
      showToast("Employee created successfully", "success");
      
      // Navigate after a delay to allow toast to be seen
      setTimeout(() => {
        navigate("/employees"); //navigate to employees page after successful submission
      }, 2000);
      
    } catch (error) {
      console.error("Error creating employee:", error); //log errors
      
      // Show error toast instead of alert
      showToast("Failed to create employee", "error");
    } finally {
      setLoading(false); //disable loading state
    }
  };

  // Show loader while creating employee
  if (loading) return <Loader message="Creating employee..." />;

  return (
    <>
      {/* Toast container */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={3000}
        />
      )}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Full_name"
          placeholder="Full Name"
          value={formData.Full_name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
        />

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

        <input type="file" accept="image/*" onChange={handleFileChange} />

        {preview && <img src={preview} alt="Preview" width="100" />}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Employee"}
        </button>
      </form>
    </>
  );
}