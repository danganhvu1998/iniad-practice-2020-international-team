import { setRoomStatus } from '../../../redis/room';
import { io } from '../../../server';

export const event = {
    occorPossibility: 0.05,
    name: 'BASE NAME',
    description: 'DESCRIPTION GOES HERE',
    affect: {
        economy: 0, society: 0, environment: 0, income: -0,
    },
};

event.checkOccurCondition = (roomStat) => {
    if (roomStat) return true;
    return false;
};

event.isApplyToUser = (userStatus) => {
    if (userStatus) return true;
    return false;
};

event.info = (eventInfo) => ({
    name: eventInfo.name,
    description: eventInfo.description,
    affect: eventInfo.affect,
});

event.isOccur = async (roomStat, eventInfo) => {
    if (Math.random() > eventInfo.occorPossibility) return false;
    if (!eventInfo.checkOccurCondition(roomStat)) return false;
    // EVENT OCCOR HERE
    const users = roomStat.gameStatus;
    for (let i = 0; i < users.length; i += 1) {
        const userStatus = users[i].status;
        if (eventInfo.isApplyToUser(userStatus)) {
            users[i].status.economy *= (100.0 + eventInfo.affect.economy) / 100;
            users[i].status.society *= (100.0 + eventInfo.affect.society) / 100;
            users[i].status.environment *= (100.0 + eventInfo.affect.environment) / 100;
            users[i].status.income *= (100.0 + eventInfo.affect.income) / 100;
        }
        await setRoomStatus(roomStat.name, { gameStatus: JSON.stringify(users) });
    }
    io.to(roomStat.name).emit('eventOccur', eventInfo.info(eventInfo));
    return true;
};
