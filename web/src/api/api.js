import axios from "axios";

// base url connecting to employee api running on local backend server
// this url will be prefixed to every api request
const API_BASE_URL = "http://localhost:5000/api/employees";

// create a reusable axios instance
// do NOT set default Content-Type for formData requests
const instance = axios.create({
  baseURL: API_BASE_URL, // base api endpoint
  timeout: 10000, // maximum wait time for a request (10 seconds)
  // removed default headers
});

// function to fetch the all employees from backend
export const getEmployees = async () => {
  try {
    const res = await instance.get("/");
    return res.data;
  } catch (error) {
    console.log("Error fetching employees:", error);
    throw error;
  }
};

// function to fetch a single employee using employee id
export const getEmployeeById = async (id) => {
  try {
    const res = await instance.get(`/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error fetching employee by ID:", error);
    throw error;
  }
};

// function to create a new employee
// employeeData is expected to be FormData (text + image)
export const createEmployee = async (employeeData) => {
  try {
    console.log("Creating employee with data:", employeeData);

    if (employeeData instanceof FormData) {
      console.log("employeeData is FormData");
      for (let [key, value] of employeeData.entries()) {
        console.log(key, "=>", typeof value, value);
      }
    }

    // send post request with form-data headers
    const res = await instance.post("/", employeeData, {
      headers: {
        "Content-Type": "multipart/form-data", // required for file upload
      },
    });

    console.log("Employee created successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
      console.error("Status:", error.response.status);
    }
    throw error;
  }
};

// function to update an existing employee
export const updateEmployee = async (id, employeeData) => {
  try {
    console.log("Updating employee with ID:", id, "and data:", employeeData);

    if (employeeData instanceof FormData) {
      console.log("FormData entries:");
      for (let [key, value] of employeeData.entries()) {
        console.log(key, "=>", value);
      }
    }

    const res = await instance.put(`/${id}`, employeeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Employee data updated successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

// function to delete an employee
export const deleteEmployee = async (id) => {
  try {
    const res = await instance.delete(`/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};
