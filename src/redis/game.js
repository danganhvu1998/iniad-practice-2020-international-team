import _ from 'lodash';
import { investments } from './constance';
import {
    rpopAsync, lpushAsync, llenAsync, incrAsync, decrAsync,
} from './index';
// eslint-disable-next-line import/no-cycle
import {
    getRoomName, getRoomStat, deleteRoom, getRedisRoomStatName,
    setRoomStatus,
} from './room';

const roomsList = 'roomsList';

export async function addRoomCodeToList(roomCode) {
    await lpushAsync(roomsList, roomCode);
}

export async function getNextRoomStat() {
    while (await llenAsync(roomsList)) {
        const nextRoomCode = await rpopAsync(roomsList);
        const nextRoomName = getRoomName(nextRoomCode);
        const nextRoomStatus = await getRoomStat(nextRoomName);
        // logger.debug(`Check ${nextRoomName} last update: ${nextRoomStatus?.updatedAt || 0}`);
        if (new Date().getTime() - nextRoomStatus?.updatedAt < 600000) { // 10 min
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

export async function userInvest(userId, roomNameOrCode, investmentId) {
    const roomName = getRoomName(roomNameOrCode);
    const roomStats = await getRoomStat(roomName);
    const status = roomStats.gameStatus || [];
    let investment = {};
    try {
        investment = investments[investmentId];
    } catch {
        return {};
    }
    for (let i = 0; i < status.length; i += 1) {
        if (status[i].user.id === userId) {
            const investedList = status[i].status.invested || [];
            if (
                _.intersection(investedList, investment.require).length !== investment.require.length
                || investedList.includes(investmentId)
                || status[i].status.money < investment.cost
            ) break;
            await new Promise((r) => setTimeout(r, investment.time * 1000));
            status[i].status.invested.push(investmentId);
            status[i].status.economy *= (100.0 + investment.affect.economy) / 100;
            status[i].status.society *= (100.0 + investment.affect.society) / 100;
            status[i].status.environment *= (100.0 + investment.affect.environment) / 100;
            status[i].status.income *= (100.0 + investment.affect.income) / 100;
            await setRoomStatus(roomName, { gameStatus: JSON.stringify(status) });
        }
    }
    const roomNewStats = await getRoomStat(roomName);
    return roomNewStats;
}
