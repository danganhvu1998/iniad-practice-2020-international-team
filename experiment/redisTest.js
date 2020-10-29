const { promisify } = require('util');
const redis = require('redis');

const client = redis.createClient();

client.on('error', (error) => {
    console.error(error);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const keysAsync = promisify(client.keys).bind(client);

async function test() {
    await setAsync('abc0', 'cde');
    await setAsync('abc1', 'cde');
    await setAsync('abc2', 'cde');
    console.log(await keysAsync('*2'));
    console.log(await keysAsync('ab*'));
    console.log(await getAsync('abc0'));
    console.log(await getAsync('abc3'));
}

test();
