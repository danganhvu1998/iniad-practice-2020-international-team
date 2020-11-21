import { customLogger } from '../helpers/logger';
import {
    rpopAsync, lpushAsync, llenAsync, incrAsync, decrAsync,
} from './index';
// eslint-disable-next-line import/no-cycle
import {
    getRoomName, getRoomStat, deleteRoom, getRedisRoomStatName,
} from './room';

const roomsList = 'roomsList';
const logger = customLogger('healthCheck');

export async function addRoomCodeToList(roomCode) {
    await lpushAsync(roomsList, roomCode);
}

export async function getNextRoomStat() {
    while (await llenAsync(roomsList)) {
        const nextRoomCode = await rpopAsync(roomsList);
        const nextRoomName = getRoomName(nextRoomCode);
        const nextRoomStatus = await getRoomStat(nextRoomName);
        logger.debug(`Check ${nextRoomName} last update: ${nextRoomStatus?.updatedAt || 0}`);
        if (new Date().getTime() - nextRoomStatus?.updatedAt < 300000) { // 2mins
            await addRoomCodeToList(nextRoomName);
            return nextRoomStatus;
        }
        await deleteRoom(nextRoomCode);
    }
    return null;
}

export async function userReady(roomNameOrCode) {
    const roomName = getRoomName(roomNameOrCode);
    await incrAsync(getRedisRoomStatName(roomName, 'playerReadyCount'));
}

export async function userNotReady(roomNameOrCode) {
    const roomName = getRoomName(roomNameOrCode);
    await decrAsync(getRedisRoomStatName(roomName, 'playerReadyCount'));
}
