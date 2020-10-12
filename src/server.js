#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Module dependencies.
 */

const debug = require('debug')('shozemi-web-app:server');
const http = require('http');
const SOCKET = require('socket.io');
const app = require('./app');
const { socketAction } = require('./middleware/socket.io');

/**
 * Get port from environment and store in Express.
 */

const port = parseInt(process.env.PORT || '3000', 10);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
export const io = SOCKET.listen(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*', // or the specific origin you want to give access to,
            'Access-Control-Allow-Credentials': true,
        };
        res.writeHead(200, headers);
        res.end();
    },
});

io.on('connection', (socket) => socketAction(socket));

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
    console.log('server listening on port: ', port);
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}

server.on('error', onError);
server.on('listening', onListening);
