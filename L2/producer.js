import { connect } from "amqplib";

async function sendmail() {
  try {
    const connection = await connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const exchange = "mail_exchange";
    const routingKeyForSubUser = "send_mail_to_subcribed_user";
    const routingKeyForNormalUser = "send_mail_to_normal_user";
    const queueForSubUser = "subcribed_user_mail_queue";
    const queueForNormalUser = "normal_user_mail_queue";

    const message = {
      to: "subuser@gmail.com",
      from: "subuser@gmail.com",
      subject: "Sub User Email",
      body: "This is a sub user email",
    };

    await channel.assertExchange(exchange, "direct", { durable: false });

    await channel.assertQueue(queueForSubUser, { durable: false });
    await channel.assertQueue(queueForNormalUser, { durable: false });

    await channel.bindQueue(queueForSubUser, exchange, routingKeyForSubUser);
    await channel.bindQueue(
      queueForNormalUser,
      exchange,
      routingKeyForNormalUser,
    );

    channel.publish(
      exchange,
      routingKeyForSubUser,
      Buffer.from(JSON.stringify(message)),
    );

    console.log("Message sent to queue", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

sendmail();
