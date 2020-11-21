import {
    createNewRoom, putNewUserToRoom, getRoomStat,
    isRoomExist, kickUserFromRoom,
} from '../../redis/room';
import { logger } from '../../helpers/logger';

export async function joinRoom(user, roomCode) {
    if (user.room) return null;
    const roomStat = await getRoomStat(roomCode);
    if (roomStat.playerCount >= 4) { // Max players in 1 room
        return null;
    }
    const room = await putNewUserToRoom(roomCode, user);
    user.room = room;
    user.socket.join(user.room.name);
    return room;
}

export async function createRoom(user) {
    if (user.room) return null;
    const newRoom = await createNewRoom();
    logger.debug(`${user.id} has created room ${newRoom.code}`);
    await joinRoom(user, newRoom.code);
    return newRoom;
}

export async function leaveRoom(user) {
    if (!user.room) return true;
    if (await isRoomExist(user.room.code)) {
        await kickUserFromRoom(user.room.code, user);
    }
    user.socket.leave(user.room.name);
    delete user.room;
    return true;
}
