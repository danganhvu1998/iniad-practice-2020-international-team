import { logger } from '../../helpers/logger';
import { io } from '../../server';

export function socketAction(socket) {
    // TODO: AUTH NEW CONNECTION
    logger.debug(`New Connection: ${'NOT YET DO AUTH'}`);
    socket.on('sendChatMessage', (msg) => {
        logger.debug(`message: ${msg}`);
        io.emit('newChatMessage', `SOME ONE: ${msg}`);
    });
    socket.on('sendDecision', (decision) => {
        logger.debug(`message: ${decision}`);
        io.emit('decisionAccepted', decision);
        io.emit('gameStatus', {
            users: [
                {
                    id: 1,
                    health: 100,
                    money: 10000,
                    population: 1000000,
                    etc: 'abc',
                },
                {
                    id: 2,
                    health: 90,
                    money: 1000,
                    population: 1000000,
                    etc: 'abc',
                },
                {
                    id: 1,
                    health: 50,
                    money: 1000000,
                    population: 1000000,
                    etc: 'abc',
                },
            ],
        });
    });
}
