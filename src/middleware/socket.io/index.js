import { authToken } from './auth';
import { sendGlobleMessage, sendRoomMessage } from './chat';
import {
    createRoom, joinRoom, leaveRoom, getRoomStatus,
} from './room';
import { ready, notReady, invest } from './game';

export function socketAction(socket) {
    // TODO: AUTH NEW CONNECTION
    const user = authToken(socket?.handshake?.query?.token);
    user.socket = socket;
    console.log('NEW CONNECTION', user.name, user.id);
    // USER STATUS
    socket.on('getCurrentStatus', () => { socket.emit('userInfo', { name: user.name, id: user.id, room: user.room }); });
    // CHAT
    socket.on('sendGlobalChatMessage', (msg) => sendGlobleMessage(msg, user));
    socket.on('sendRoomChatMessage', (msg) => sendRoomMessage(msg, user));
    // ROOM
    socket.on('createNewRoom', () => createRoom(user));
    socket.on('joinRoom', (roomCode) => joinRoom(user, roomCode));
    socket.on('getRoomStat', () => getRoomStatus(user));
    socket.on('leaveRoom', () => leaveRoom(user));
    // GAME
    socket.on('ready', () => ready(user));
    socket.on('notReady', () => notReady(user));
    socket.on('invest', (investmentId) => invest(user, investmentId));
    // DISCONNECT
    socket.on('disconnect', () => {
        leaveRoom(user);
    });
}
