// backend/server.js
// Entry point for the Express server
//importing required modules
const express = require("express"); //importing express module
const dotenv = require("dotenv"); //importing dotenv module to manage environment variables
const cors = require("cors"); //importing cors module to handle Cross-Origin Resource Sharing
const connectDB = require("./config/db"); //importing the database connection function
const upload = require("./middlewares/upload"); //importing the upload middleware for handling file uploads

dotenv.config(); //loading environment variables from .env file
const app = express(); //creating an instance of express application

//Middleware setup
app.use(cors());
app.use(cors({
  origin: "http://localhost:3000", // web frontend
  credentials: true
}));
app.use("/uploads", express.static("uploads")); //serving static files from uploads directory
app.use("/api/employees", require("./routes/employeeRoutes"));//

app.use(express.json()); //middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
connectDB(); //connecting to the database


app.get("/", (req, res) => {
  //defining a route for the root URL
  res.send("Server is running...");
});

//starting the server on port 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000"); //starting the server on port 5000
});
