// backend/services/employeeService.js
const Employee = require("../models/employee"); //importing the Employee model
const upload = require("../middlewares/upload"); //importing the upload middleware for handling file uploads

// Service function to create a new employee
const createEmployee = async (data, file) => {
  const employee = new Employee({
    Full_name: data.Full_name,
    position: data.position,
    department: data.department,
    email: data.email,
    image_url: file ? `/uploads/${file.filename}` : null, // store full path starting from server root for easier frontend access
  });
  return await employee.save(); //saving the new employee to the database
};

// Service function to get all employees, with optional department filtering
const getAllEmployees = async (department) => {
  //if department is provided filter by department
  const filter = department ? { department } : {}; //filter object for querying employees
  return await Employee.find(filter); //retrieving employees from the database based on the filter
};

// Service function to get an employee by ID
const getEmployeeById = async (id) => {
  return await Employee.findById(id); //retrieving an employee by their ID
};

// Service function to update an existing employee
// Parameters:
//   id   - the MongoDB ObjectId of the employee to update
//   data - an object containing fields to update (Full_name, position, department, email)
//   file - optional uploaded file object for profile image
const updateEmployee = async (id, data, file) => {
  // Create an object containing only the allowed fields to update
  // This prevents accidental overwriting of sensitive fields like _id or createdAt
  const updatedData = {
    Full_name: data.Full_name,
    position: data.position,
    department: data.department,
    email: data.email,
  };

  // If a new profile image is uploaded, add it to the updatedData object
  // Store full path starting from server root for consistent frontend access
  if (file) {
    updatedData.image_url = `/uploads/${file.filename}`; // save full path from server root
  }

  // Update the employee document in the database
  // 'new: true' ensures that the returned value is the updated document
  return await Employee.findByIdAndUpdate(id, updatedData, {
    new: true,
  });
};

// Service function to delete an employee by ID
const deleteEmployee = async (id) => {
  return await Employee.findByIdAndDelete(id); //deleting an employee by their ID
};

//exporting the service functions for use in other parts of the application 
module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};