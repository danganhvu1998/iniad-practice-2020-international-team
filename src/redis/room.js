import {
    setAsync, getAsync, delAsync, incrAsync,
    decrAsync,
} from './index';
import { getRandomString } from '../helpers/commonFunctions';
import { roomAllStats, initStatus } from './constance';
// eslint-disable-next-line import/no-cycle
import { addRoomCodeToList } from './game';

export function getRoomName(roomNameOrCode) {
    return roomNameOrCode.startsWith('room') ? roomNameOrCode : `room${roomNameOrCode}`;
}

export function getRedisRoomStatName(roomNameOrCode, stat) {
    const roomName = getRoomName(roomNameOrCode);
    return `${roomName}:${stat}`;
}

export async function setRoomStatus(roomNameOrCode, params = {}) {
    const roomName = getRoomName(roomNameOrCode);
    params.updatedAt = new Date().getTime();
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
        try {
            res[stat] = JSON.parse(res[stat]);
        } catch (e) {
            // Ignore malformed lines.
        }
    }
    if (res?.isExisting) {
        if (res.isPlaying && res.gameStatus) {
            const newGameStatus = [];
            res.gameStatus.forEach((userStatus) => {
                userStatus.status.money += userStatus.status.income * (new Date().getTime() - res.updatedAt);
                newGameStatus.push(userStatus);
            });
            res.gameStatus = newGameStatus;
        }
        return res;
    }
    return null;
}

export async function isRoomExist(roomNameOrCode) {
    const roomName = getRoomName(roomNameOrCode);
    const roomStats = await getRoomStat(roomName);
    if (roomStats?.isExisting) return true;
    return false;
}

export async function createNewRoom() {
    for (let tryTime = 0; tryTime < 100; tryTime += 1) {
        const roomCode = getRandomString();
        if (!await isRoomExist(roomCode)) {
            await setRoomStatus(roomCode, { isExisting: 1, playerCount: 0, code: roomCode });
            const roomStats = await getRoomStat(roomCode);
            addRoomCodeToList(roomCode);
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

export async function putNewUserToRoom(roomNameOrCode, user) {
    const roomName = getRoomName(roomNameOrCode);
    await incrAsync(getRedisRoomStatName(roomName, 'playerCount'));
    const roomStats = await getRoomStat(roomName);
    const status = roomStats.gameStatus || [];
    status.push({
        user: {
            name: user.name,
            id: user.id,
        },
        status: initStatus,
    });
    await setRoomStatus(roomName, { gameStatus: JSON.stringify(status) });
    const roomNewStats = await getRoomStat(roomName);
    return roomNewStats;
}

export async function kickUserFromRoom(roomNameOrCode, user) {
    const roomName = getRoomName(roomNameOrCode);
    await decrAsync(getRedisRoomStatName(roomName, 'playerCount'));
    const roomStats = await getRoomStat(roomName);
    if (roomStats.playerCount <= 0) {
        const newRoomStat = await deleteRoom(roomNameOrCode);
        return newRoomStat;
    }
    const status = roomStats.gameStatus || [];
    for (let i = 0; i < status.length; i += 1) {
        if (status[i].user.id === user.id) {
            status.splice(i, 1);
        }
    }
    await setRoomStatus(roomName, { gameStatus: JSON.stringify(status) });
    const roomNewStats = await getRoomStat(roomName);
    return roomNewStats;
}
