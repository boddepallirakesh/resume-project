require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT)
  }
});

client.connect()
  .then(async () => {
    console.log('✅ Connected to Redis');
    await client.set('testkey', 'Hello Redis!');
    const val = await client.get('testkey');
    console.log('Value from Redis:', val);
    await client.quit();
  })
  .catch(err => console.error('❌ Redis Error:', err));
