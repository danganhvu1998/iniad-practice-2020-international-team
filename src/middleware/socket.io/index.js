import { create } from 'lodash';
import { logger } from '../../helpers/logger';
import { io } from '../../server';
import { authToken } from './auth';
import { sendGlobleMessage, sendRoomMessage } from './chat';
import { createRoom, joinRoom, leaveRoom } from './room';

export function socketAction(socket) {
    // TODO: AUTH NEW CONNECTION
    const user = authToken(socket?.handshake?.query?.token);
    user.socket = socket;
    // USER STATUS
    socket.on('getCurrentStatus', () => { socket.emit('userInfo', { name: user.name, room: user.room }); });
    // CHAT
    socket.on('sendGlobalChatMessage', (msg) => sendGlobleMessage(msg, user));
    socket.on('sendRoomChatMessage', (msg) => sendRoomMessage(msg, user));
    // ROOM
    socket.on('createNewRoom', () => createRoom(user));
    socket.on('joinRoom', (roomCode) => joinRoom(user, roomCode));
    socket.on('leaveRoom', () => leaveRoom(user));
    // DISCONNECT
    socket.on('disconnect', () => {
        leaveRoom(user);
    });
}
