import {
    getNextRoomStat, userReady, userNotReady, userInvest,
} from '../../redis/game';
import { getRoomStat, setRoomStatus } from '../../redis/room';
import { llenAsync } from '../../redis';
import { io } from '../../server';
import { eventsList } from './gameEvent';

const roomsList = 'roomsList';

export async function sendGameStatToNextRoom() {
    // IMPORTANT: HERE ALSO SEND EVENT TO ROOM
    const nextRoomStat = await getNextRoomStat();
    if (nextRoomStat) {
        let roomStat = nextRoomStat;
        console.log('RUNNING CHECK ON', roomStat.name);
        if (roomStat.isPlaying) {
            for (let i = 0; i < eventsList.length; i += 1) {
                if (eventsList[i].isOccur(roomStat, eventsList[i])) {
                    roomStat = await getRoomStat(roomStat.name);
                    console.log('EVENT OCCUR', eventsList[i].name, roomStat.code);
                }
            }
        }
        io.to(roomStat.name).emit('roomStat', roomStat);
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
        await new Promise((r) => setTimeout(r, 1000 / roomCount));
    }
}

export async function gameStart(roomNameOrCode) {
    await setRoomStatus(roomNameOrCode, { isPlaying: true, startAt: new Date().getTime() });
    const gameStat = await getRoomStat(roomNameOrCode);
    if (gameStat) {
        io.to(gameStat.name).emit('gameStart', gameStat);
    }
}

export async function notReady(user) {
    console.log('NOT READY', user.id, user.room.code);
    if (!user.room) return;
    if (!user.room.ready) return;
    user.room.ready = 0;
    await userNotReady(user.room.name);
}

export async function ready(user) {
    console.log('READY', user.id, user.room.code);
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
    console.log('INVEST', user.id, user.room.code, investmentId);
    if (!user.room) return;
    const gameStat = await getRoomStat(user.room.name);
    if (!gameStat.isPlaying) return;
    await userInvest(user, user.room.name, investmentId);
}
