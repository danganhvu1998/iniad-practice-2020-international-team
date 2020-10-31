import { getNextRoomStat } from '../../redis/game';
import { io } from '../../server';

export async function sendGameStatToNextRoom() {
    const nextGameStat = await getNextRoomStat();
    console.log('SEND STAT TO', nextGameStat?.name);
    if (nextGameStat) {
        io.to(nextGameStat.name).emit('roomStat', nextGameStat);
    }
}

export async function sendAllGameStatsToRooms() {
    while (true) {
        sendGameStatToNextRoom();
        await new Promise((r) => setTimeout(r, 1000));
    }
}
