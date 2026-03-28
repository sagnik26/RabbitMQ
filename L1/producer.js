import { connect } from "amqplib";

async function sendmail(params) {
  try {
    const connection = await connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const exchange = "mail_exchange";
    const routingKey = "send_mail";
    const queue = "mail_queue";

    const message = {
      to: "realtime@gmail.com",
      from: "realtime2468@gmail.com",
      subject: "Test Email",
      body: "This is a test email",
    };

    await channel.assertExchange(exchange, "direct", { durable: false });
    await channel.assertQueue(queue, { durable: false });
    await channel.bindQueue(queue, exchange, routingKey);

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    console.log("Message sent to queue", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

sendmail("TEST");
