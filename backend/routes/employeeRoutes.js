// backend/routes/employeeRoutes.js
const express = require("express");//importing express module to create router
const router = express.Router();//creating an instance of express router
const upload = require("../middlewares/upload");//importing the upload middleware for handling file uploads 
const employeeController = require("../controllers/employeeController");//importing the employee controller module

// Create employee
router.post("/", upload.single("image_url"), employeeController.createEmployee);

// Get all employees
router.get("/", employeeController.getAllEmployees);

// Get employee by ID
router.get("/:id", employeeController.getEmployeeById);

// Update employee
router.put("/:id", upload.single("image_url"), employeeController.updateEmployee);

// Delete employee
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;  //exporting the router to be used in other parts of the application
