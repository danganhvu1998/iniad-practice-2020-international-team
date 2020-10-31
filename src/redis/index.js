import redis from 'redis';
import { promisify } from 'util';
import logger from '../helpers/logger';

const client = redis.createClient();

client.on('error', (error) => {
    logger.error(error);
});

export const getAsync = promisify(client.get).bind(client);
export const setAsync = promisify(client.set).bind(client);
export const keysAsync = promisify(client.keys).bind(client);
export const delAsync = promisify(client.del).bind(client);
export const incrAsync = promisify(client.incr).bind(client);

export function newRedisConnection() {
    return redis.createClient();
}
