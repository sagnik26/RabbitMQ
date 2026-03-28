import amqp from "amqplib";

async function receiveMessages() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const exchange = "notification_exchange";
    const exchangeType = "topic";
    const queue = "order_queue";

    await channel.assertExchange(exchange, exchangeType, { durable: false });
    await channel.assertQueue(queue, { durable: false });
    await channel.bindQueue(queue, exchange, "order.*");

    console.log("Waiting for messages...");
    channel.consume(
      queue,
      (message) => {
        if (message !== null) {
          console.log(
            "[Order Notification Service] Message received from queue",
            JSON.parse(message.content.toString()),
          );
          channel.ack(message);
        }
      },
      {
        noAck: false,
      },
    );
  } catch (error) {
    console.log(error);
  }
}

receiveMessages();
