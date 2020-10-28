const { promisify } = require('util');
const redis = require('redis');

const client = redis.createClient();

client.on('error', (error) => {
    console.error(error);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

async function test() {
    await setAsync('abc', 'cde');
    console.log(await getAsync('abc'));
}

test();
