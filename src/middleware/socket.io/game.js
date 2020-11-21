import {
    getNextRoomStat, userReady, userNotReady, userInvest,
} from '../../redis/game';
import { getRoomStat, setRoomStatus } from '../../redis/room';
import { llenAsync } from '../../redis';
import { io } from '../../server';

const roomsList = 'roomsList';

export async function sendGameStatToNextRoom() {
    const nextGameStat = await getNextRoomStat();
    if (nextGameStat) {
        io.to(nextGameStat.name).emit('roomStat', nextGameStat);
    }
}

export async function sendGameStatTo(roomNameOrCode) {
    const gameStat = await getRoomStat(roomNameOrCode);
    if (gameStat) {
        io.to(gameStat.name).emit('roomStat', gameStat);
    }
}

export async function sendAllGameStatsToRooms() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        sendGameStatToNextRoom();
        const roomCount = await llenAsync(roomsList) || 1;
        await new Promise((r) => setTimeout(r, 30000 / roomCount));
    }
}

export async function gameStart(roomNameOrCode) {
    await setRoomStatus(roomNameOrCode, { isPlaying: true });
    const gameStat = await getRoomStat(roomNameOrCode);
    if (gameStat) {
        io.to(gameStat.name).emit('gameStart', gameStat);
    }
}

export async function notReady(user) {
    if (!user.room) return;
    if (!user.room.ready) return;
    user.room.ready = 0;
    await userNotReady(user.room.name);
}

export async function ready(user) {
    if (!user.room) return;
    if (user.room.ready) return;
    user.room.ready = 1;
    await userReady(user.room.name);
    const gameStat = await getRoomStat(user.room.name);
    if (gameStat.playerCount === gameStat.playerReadyCount) {
        gameStart(user.room.name);
    }
}

export async function invest(user, investmentId) {
    if (!user.room) return;
    const gameStat = await getRoomStat(user.room.name);
    if (!gameStat.isPlaying) return;
    await userInvest(user.id, user.room.name, investmentId);
}
