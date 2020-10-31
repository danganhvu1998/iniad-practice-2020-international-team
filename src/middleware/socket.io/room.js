import {
    createNewRoom, putNewUserToRoom, getRoomStat,
    isRoomExist, kickUserFromRoom,
} from '../../redis/room';

export async function joinRoom(user, roomCode) {
    if (user.room) return null;
    const roomStat = getRoomStat(roomCode);
    if (roomStat.playerCount >= 4) { // Max players in 1 room
        return null;
    }
    const room = await putNewUserToRoom(roomCode);
    user.room = room;
    user.socket.join(user.room.name);
    return room;
}

export async function createRoom(user) {
    if (user.room) return null;
    const newRoom = await createNewRoom();
    await joinRoom(user, newRoom.code);
    return newRoom;
}

export async function leaveRoom(user) {
    if (!user.room) return true;
    if (await isRoomExist(user.room.code)) {
        await kickUserFromRoom(user.room.code);
    }
    delete user.room;
    user.socket.leaveRoom(user.room.name);
    return true;
}
