const express = require("express");

const User = require("./User");

const {
  publishUserCreated
} = require("./rabbitmq");

const router = express.Router();


router.post("/", async (req, res) => {

  try {

    const {
      name,
      email
    } = req.body;


    if (!name || !email) {

      return res.status(400).json({
        message: "Name and email are required"
      });

    }


    const existingUser =
      await User.findOne({ email });


    if (existingUser) {

      return res.status(409).json({
        message: "User already exists"
      });

    }


    // Create user in MongoDB

    const user = await User.create({
      name,
      email
    });


    // Send event to RabbitMQ

    await publishUserCreated(user);


    res.status(201).json({
      message: "User created",
      user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Something went wrong"
    });

  }

});


router.get("/", async (req, res) => {

  const users = await User.find();

  res.json(users);

});


module.exports = router;