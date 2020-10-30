import { func } from '@hapi/joi';
import { level } from 'winston';
import { io } from '../../server';
import { getRandomString } from '../../helpers/commonFunctions';
import {
    createNewRoom, deleteRoom, putNewUserToRoom, getRoomStat,
    isRoomExist, kickUserFromRoom,
} from '../../redis/room';

export async function joinRoom(user, roomCode) {
    console.log('JOIN ROOM', roomCode);
    const roomStat = getRoomStat(roomCode);
    if (roomStat.playerCount >= 4) { // Max players in 1 room
        return null;
    }
    const room = await putNewUserToRoom(roomCode);
    user.room = room;
    // TODO implement PUB / SUB
    return room;
}

export async function createRoom(user) {
    const newRoom = await createNewRoom();
    await joinRoom(user, newRoom.code);
    return newRoom;
}

export async function leaveRoom(user) {
    if (!await isRoomExist(user.room.code)) {
        await kickUserFromRoom(user.room.code);
    }
    delete user.room;
    return true;
}
