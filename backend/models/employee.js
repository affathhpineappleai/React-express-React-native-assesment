// backend/models/employee.js
const mongoose = require("mongoose");//importing mongoose module to define schema and model

//defining employee schema
const employeeSchema = new mongoose.Schema({
  //defining fields for employee schema
  Full_name: { //full name of the employee
    type: String,
    required: true,
  },
  
  position: { //position of the employee in the company 
    type: String,
    required: true,
  },
  department: {  //department where the employee works
    type: String,
    required: true,
  },
  email: {      //email address of the employee
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  image_url: {     //URL of the employee's image
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);//exporting the Employee model based on the employee schema