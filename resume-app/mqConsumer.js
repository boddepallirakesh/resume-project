const amqp = require('amqplib');
const sendWelcomeEmail = require('./mailer');

async function mqConsumer() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue('emailQueue');

  channel.consume('emailQueue', async (msg) => {
    const email = msg.content.toString();
    console.log('Sending email to:', email);
    await sendWelcomeEmail(email);
    channel.ack(msg);
  });
}

module.exports = mqConsumer;
