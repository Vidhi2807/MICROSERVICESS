  const amqp = require("amqplib");

const Notification =
  require("./Notification");


const QUEUE = "user_created";


const connectRabbitMQ = async () => {

  try {

    const connection =
      await amqp.connect(
        process.env.RABBITMQ_URL
      );


    const channel =
      await connection.createChannel();


    await channel.assertQueue(
      QUEUE,
      {
        durable: true
      }
    );


    console.log(
      "Notification Service connected to RabbitMQ"
    );


    // Listen for messages

    channel.consume(
      QUEUE,

      async (message) => {

        if (!message) {
          return;
        }


        try {

          const event =
            JSON.parse(
              message.content.toString()
            );


          console.log(
            "\nMessage received:"
          );

          console.log(event);


          if (
            event.event === "USER_CREATED"
          ) {

            const user =
              event.data;


            // Create notification

            await Notification.create({

              userId:
                user.userId,

              message:
                `Welcome ${user.name}! Your account has been created.`,

              type: "WELCOME"

            });


            console.log(
              `Notification created for ${user.email}`
            );

          }


          // Message successfully processed

          channel.ack(message);


        } catch (error) {

          console.error(
            "Error processing message:",
            error.message
          );


          // Requeue message

          channel.nack(
            message,
            false,
            true
          );

        }

      },

      {
        noAck: false
      }

    );

  } catch (error) {

    console.error(
      "RabbitMQ connection failed:",
      error.message
    );

    process.exit(1);
  }
};


module.exports =
  connectRabbitMQ;