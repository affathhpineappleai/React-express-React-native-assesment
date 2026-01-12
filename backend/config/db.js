//database connection setup
const mongoose = require("mongoose"); //importing mongoose module to interact with mongodb


//function to connect to mongodb using mongoose 
//connection string is retrieved from environment variables 


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);//connecting to mongodb using connection string from environment variables    
    console.log("MongoDB connected successfully");//logging success message upon successful connection
  } catch (e) {//catching andlogging any errors during connection
    console.error("MongoDB connection failed:", e.message);//logging error message if connection fails
    process.exit(1);//exiting the process with failure code
  }
};
module.exports = connectDB;//exporting the connectDB function for use in other parts of the application
