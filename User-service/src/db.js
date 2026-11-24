// const mongoose = require("mongoose");

// const connectDB = async () => {
// try {
//   await mongoose.connect(process.env.MONGO_URI);

//   console.log("User DB connected");
// } catch (error) {
//   console.error("Database connection failed:", error.message);
//   process.exit(1);
// }
// }


const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("User MongoDB Atlas Connected Successfully");

    } catch (error) {
        console.log("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;