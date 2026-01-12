// Import axios library to make HTTP requests to the backend
import axios from "axios";

// Base URL of the employee API running on local backend server
// This URL will be prefixed to every API request
const API_BASE_URL = "http://192.168.8.101:5000/api/employees";

// Create a reusable Axios instance
// This avoids repeating baseURL, headers, and timeout in every request
const instance = axios.create({
  baseURL: API_BASE_URL, // Base API endpoint
  timeout: 10000, // Maximum wait time for a request (10 seconds)
  headers: {
    "Content-Type": "application/json", // Default request body type
  },
});

// Function to fetch all employees from backend
export const getEmployees = async () => {
  try {
    // Send GET request to "/api/employees/"
    const res = await instance.get("/");

    // Axios stores backend response inside res.data
    // Return the employee list to the frontend
    return res.data;
  } catch (error) {
    // Log error if API request fails
    console.error("Error fetching employees:", error);

    // Throw error so UI can handle it (show alert, loader, etc.)
    throw error;
  }
};

// Function to fetch a single employee using employee ID
export const getEmployeeById = async (id) => {
  try {
    // Send GET request to "/api/employees/:id"
    const res = await instance.get(`/${id}`);

    // Return employee object received from backend
    return res.data;
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching employee by ID:", error);

    // Forward error to calling screen
    throw error;
  }
};

// Function to create a new employee
// employeeData is expected to be FormData (text + image)
export const createEmployee = async (employeeData) => {
  try {
    // Log data being sent to backend (for debugging)
    console.log("Creating employee with data:", employeeData);

    // Check whether employeeData is FormData
    if (employeeData instanceof FormData) {
      console.log("FormData entries:");

      // Loop through FormData fields and log each key-value pair
      for (let [key, value] of employeeData.entries()) {
        console.log(key, "=>", typeof value, value);
      }
    }

    // Send POST request to create employee
    const res = await instance.post("/", employeeData, {
      headers: {
        // multipart/form-data is required for file uploads
        "Content-Type": "multipart/form-data",
      },
    });

    // Log success response from backend
    console.log("Employee created successfully:", res.data);

    // Return created employee data
    return res.data;
  } catch (error) {
    // Log generic error
    console.error("Error creating employee:", error);

    // If backend sent an error response
    if (error.response) {
      console.error("Server response:", error.response.data);
      console.error("Status:", error.response.status);
    }

    // Throw error so UI can show error message
    throw error;
  }
};

// Function to update an existing employee
// id → employee ID
// employeeData → updated FormData (with or without image)
export const updateEmployee = async (id, employeeData) => {
  try {
    // Log update request start
    console.log("Update employee request started");

    // Check and log FormData fields
    if (employeeData instanceof FormData) {
      console.log("FormData entries:");
      for (let [key, value] of employeeData.entries()) {
        console.log(key, "=>", value);
      }
    }

    // Send PUT request to "/api/employees/:id"
    const res = await instance.put(`/${id}`, employeeData, {
      headers: {
        // multipart/form-data needed for image update
        "Content-Type": "multipart/form-data",
      },
    });

    // Log successful update response
    console.log("Employee updated successfully:", res.data);

    // Return updated employee data
    return res.data;
  } catch (error) {
    // Log update error
    console.error("Error updating employee:", error);

    // Forward error to screen
    throw error;
  }
};

// Function to delete an employee by ID
export const deleteEmployee = async (id) => {
  try {
    // Send DELETE request to "/api/employees/:id"
    const res = await instance.delete(`/${id}`);

    // Return backend response (success message)
    return res.data;
  } catch (error) {
    // Log delete error
    console.error("Error deleting employee:", error);

    // Throw error so UI can show alert
    throw error;
  }
};
