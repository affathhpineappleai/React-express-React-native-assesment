// backend/controllers/employeeController.js
const employeeService = require("../services/employeeService"); //importing the employee service module

//controller function to create a new employee
exports.createEmployee = async (req, res) => {
  try {
    //try block to handle potential errors
    const employee = await employeeService.createEmployee(req.body, req.file); //calling service function to create employee
    res.status(201).json(employee); //sending success response with created employee data
  } catch (error) {
    //catch block to handle errors
    res.status(500).json({ message: error.message }); //sending error response with error message
  }
};

//controller function to get all employees, with optional department filtering
exports.getAllEmployees = async (req, res) => {
  try {
    //try block to handle potential errors
    const department = req.query.department; //retrieving department filter from query parameters
    const employees = await employeeService.getAllEmployees(department); //calling service function to get all employees
    res.status(200).json(employees); //sending success response with employee data
  } catch (error) {
    //catch block to handle errors
    res.status(500).json({ message: error.message }); //sending error response with error message
  }
};

//controller function to get an employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    //try block to handle potential errors
    const employee = await employeeService.getEmployeeById(req.params.id); //calling service function to get employee by ID
    res.status(200).json(employee); //sending success response with employee data
  } catch (e) {
    //catch block to handle errors
    res.status(500).json({ message: e.message }); //sending error response with error message
  }
};

//controller function to update an existing employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await employeeService.updateEmployee(
      req.params.id,
      req.body,
      req.file
    ); //calling service function to update employee
    res.status(200).json(employee); //sending success response with updated employee data
  } catch (e) {
    //catch block to handle errors
    res.status(500).json({ message: e.message }); //sending error response with error message
  }
};

//controller function to delete an employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    await employeeService.deleteEmployee(req.params.id); //calling service function to delete employee by ID
    res.status(200).json({ message: "Employee deleted successfully" }); //sending success response
  } catch (e) {
    //catch block to handle errors
    res.status(500).json({ message: e.message }); //sending error response with error message
  }
};
