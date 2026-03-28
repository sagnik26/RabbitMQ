import { connect } from "amqplib";

async function sendMessage(routingKey, message) {
  try {
    const connection = await connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const exchange = "notification_exchange";
    const exchangeType = "topic";

    await channel.assertExchange(exchange, exchangeType, { durable: false });

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    console.log("Message sent to queue", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

sendMessage("order.placed", { orderId: 14651, status: "placed" });
sendMessage("payment.processed", { paymentId: 76854, status: "processed" });
