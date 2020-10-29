import { io } from '../../server';
import { getRandomString } from '../../helpers/commonFunctions';
import { createNewRoom, deleteRoom } from '../../redis/room';

export async function createRoom(user) {
    console.log(user);
    const newRoom = await createNewRoom();
    console.log('NEW ROOM', newRoom);
    console.log(await deleteRoom(newRoom.name));
}
