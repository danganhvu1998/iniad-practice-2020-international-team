import { logger } from '../../helpers/logger';
import { io } from '../../server';

export function sendGlobleMessage(msg, user) {
    io.emit('newGlobalChatMessage', `${user.name}: ${msg}`);
}

export function sendRoomMessage(msg, user) {
    if (user?.room?.name) {
        io.to(user?.room?.name).emit('newRoomChatMessage', `${user.name}: ${msg}`);
    }
}
