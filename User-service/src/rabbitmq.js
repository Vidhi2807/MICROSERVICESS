const amqp = require("amqplib");

let channel;

const QUEUE = "user_created";

const connectRabbitMQ = async () => {
  try {
    const connection =
      await amqp.connect(process.env.RABBITMQ_URL);

    channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, {
      durable: true
    });

    console.log("User Service connected to RabbitMQ");
  } catch (error) {
    console.error(
      "RabbitMQ connection failed:",
      error.message
    );

    process.exit(1);
  }
};


const publishUserCreated = async (user) => {

  const message = {
    event: "USER_CREATED",

    data: {
      userId: user._id.toString(),
      name: user.name,
      email: user.email
    }
  };

  channel.sendToQueue(
    QUEUE,
    Buffer.from(JSON.stringify(message)),
    {
      persistent: true
    }
  );

  console.log(
    "USER_CREATED event sent to RabbitMQ"
  );
};


module.exports = {
  connectRabbitMQ,
  publishUserCreated
};