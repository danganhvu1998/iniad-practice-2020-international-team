import { create } from 'lodash';
import { logger } from '../../helpers/logger';
import { io } from '../../server';
import { authToken } from './auth';
import { sendGlobleMessage } from './chat';
import { createRoom } from './room';

export function socketAction(socket) {
    // TODO: AUTH NEW CONNECTION
    const user = authToken(socket?.handshake?.query?.token);
    console.log(user);
    socket.emit('userInfo', user);
    socket.on('sendGlobalChatMessage', (msg) => {
        sendGlobleMessage(msg, user);
    });
    socket.on('createNewRoom', (msg) => createRoom(user));
}
