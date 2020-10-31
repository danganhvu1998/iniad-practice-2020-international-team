import {
    rpopAsync, lpushAsync, llenAsync,
} from './index';
// eslint-disable-next-line import/no-cycle
import { getRoomName, getRoomStat, deleteRoom } from './room';

const roomsList = 'roomsList';

export async function addRoomCodeToList(roomCode) {
    await lpushAsync(roomsList, roomCode);
}

export async function getNextRoomStat() {
    while (await llenAsync(roomsList)) {
        const nextRoomCode = await rpopAsync(roomsList);
        const nextRoomName = getRoomName(nextRoomCode);
        const nextRoomStatus = await getRoomStat(nextRoomName);
        if (nextRoomStatus) {
            await addRoomCodeToList(nextRoomName);
            return nextRoomStatus;
        }
        await deleteRoom(nextRoomCode);
    }
    return null;
}
