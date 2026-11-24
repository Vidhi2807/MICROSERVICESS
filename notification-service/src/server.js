// // require("dotenv").config();

// // const express = require("express");

// // const connectDB =
// //   require("./db");

// // const connectRabbitMQ =
// //   require("./rabbitmq");

// // const Notification =
// //   require("./Notification");


// // const app = express();

// // app.use(express.json());


// // app.get("/health", (req, res) => {

// //   res.json({
// //     service: "notification-service",
// //     status: "running"
// //   });

// // });


// // app.get(
// //   "/api/notifications",
// //   async (req, res) => {

// //     try {

// //       const notifications =
// //         await Notification.find()
// //           .sort({
// //             createdAt: -1
// //           });


// //       res.json(notifications);

// //     } catch (error) {

// //       res.status(500).json({
// //         message:
// //           "Failed to get notifications"
// //       });

// //     }

// //   }
// // );


// // const PORT =
// //   process.env.PORT || 5002;


// // const startServer = async () => {

// //   await connectDB();

// //   await connectRabbitMQ();


// //   app.listen(PORT, () => {

// //     console.log(
// //       `Notification Service running on ${PORT}`
// //     );

// //   });

// // };


// // startServer();


// const dns = require("dns");

// dns.setServers(["8.8.8.8", "1.1.1.1"]);


// require("dotenv").config();

// const express = require("express");
// const connectDB = require("./db");




const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const express = require("express");

const connectDB = require("./db");

const connectRabbitMQ = require("./rabbitmq");

const Notification = require("./Notification");

const app = express();

app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
    res.json({
        service: "notification-service",
        status: "running"
    });
});

// Get All Notifications
app.get("/api/notifications", async (req, res) => {
    try {
        const notifications = await Notification.find()
            .sort({ createdAt: -1 });

        res.json(notifications);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get notifications"
        });
    }
});

const PORT = process.env.PORT || 5002;

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        await connectRabbitMQ();

        app.listen(PORT, () => {
            console.log(
                `Notification Service running on ${PORT}`
            );
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
