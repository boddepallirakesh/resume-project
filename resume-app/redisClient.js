const Redis = require('ioredis');

console.log('🔧 Connecting to Redis...');
console.log('🔧 REDIS HOST:', process.env.REDIS_HOST);
console.log('🔧 REDIS PORT:', process.env.REDIS_PORT);

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  tls: {} // Required for ElastiCache serverless/Valkey
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

module.exports = redis;
