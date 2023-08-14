import redis from 'redis';

const client = redis.createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

export default client;

export const CACHE_CHARACTER_KEY = 'characters'
