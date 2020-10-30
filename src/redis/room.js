import { setAsync, getAsync, delAsync } from './index';
import { getRandomString } from '../helpers/commonFunctions';
import { roomAllStats } from './constance';

function getRoomName(roomNameOrCode) {
    return roomNameOrCode.startsWith('room') ? roomNameOrCode : `room${roomNameOrCode}`;
}

function getRedisRoomStatName(roomNameOrCode, stat) {
    const roomName = getRoomName(roomNameOrCode);
    return `${roomName}:${stat}`;
}

export async function setRoomStatus(roomNameOrCode, params = {}) {
    const roomName = getRoomName(roomNameOrCode);
    roomAllStats.forEach(async (stat) => {
        if (params[stat]) await setAsync(getRedisRoomStatName(roomName, stat), params[stat]);
    });
}

export async function getRoomStat(roomNameOrCode, stats = roomAllStats) {
    const roomName = getRoomName(roomNameOrCode);
    const res = { name: roomName };
    for (let i = 0; i < stats.length; i += 1) {
        const stat = stats[i];
        res[stat] = await getAsync(getRedisRoomStatName(roomNameOrCode, stat));
    }
    return res;
}

export async function isRoomExist(roomNameOrCode) {
    const roomName = getRoomName(roomNameOrCode);
    const roomStats = await getRoomStat(roomName);
    if (roomStats.isExisting) return true;
    return false;
}

export async function createNewRoom() {
    for (let tryTime = 0; tryTime < 100; tryTime += 1) {
        const roomCode = getRandomString();
        if (!await isRoomExist(roomCode)) {
            await setRoomStatus(roomCode, { isExisting: 1, playerCount: 0, code: roomCode });
            const roomStats = await getRoomStat(roomCode);
            return roomStats;
        }
    }
    return null;
}

export async function deleteRoom(roomNameOrCode) {
    const roomName = getRoomName(roomNameOrCode);
    roomAllStats.forEach(async (stat) => {
        await delAsync(getRedisRoomStatName(roomName, stat));
    });
    return null;
}

export async function putNewUserToRoom(roomNameOrCode) {
    const roomName = getRoomName(roomNameOrCode);
    const roomStats = await getRoomStat(roomName);
    roomStats.playerCount = (roomStats.playerCount || 0) + 1;
    await setRoomStatus(roomStats);
    return roomStats;
}

export async function kickUserFromRoom(roomNameOrCode) {
    const roomName = getRoomName(roomNameOrCode);
    const roomStats = await getRoomStat(roomName);
    roomStats.playerCount = (roomStats.playerCount || 0) - 1;
    if (roomStats.playerCount < 0) {
        const newRoomStat = await deleteRoom(roomNameOrCode);
        return newRoomStat;
    }
    await setRoomStatus(roomStats);
    return roomStats;
}
