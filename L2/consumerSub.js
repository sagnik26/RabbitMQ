import amqp from "amqplib";

async function receivemail() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const queue = "subcribed_user_mail_queue";

    await channel.assertQueue(queue, { durable: false });

    channel.consume(queue, (message) => {
      if (message !== null) {
        console.log(
          "Message received from queue",
          JSON.parse(message.content.toString()),
        );
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

receivemail();
