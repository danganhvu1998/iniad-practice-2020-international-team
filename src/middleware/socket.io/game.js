import { getNextRoomStat, userReady, userNotReady } from '../../redis/game';
import { getRoomStat, setRoomStatus, getRoomName } from '../../redis/room';
import { io } from '../../server';

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
        await new Promise((r) => setTimeout(r, 5000));
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
    if (!user.ready) return;
    if (!user.room) return;
    user.ready = 0;
    await userNotReady(user.room.name);
}

export async function ready(user) {
    if (user.ready) return;
    if (!user.room) return;
    user.ready = 1;
    await userReady(user.room.name);
    const gameStat = await getRoomStat(user.room.name);

    if (gameStat.playerCount === gameStat.playerReadyCount) {
        gameStart(user.room.name);
    }
}

export async function invest(investmentId) {
    return 0;
}
