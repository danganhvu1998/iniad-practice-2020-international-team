import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'NUCLEAR MISSILE THREAD';
event.description = 'Please evacuate asap to vault 76';
event.occorPossibility = 0.03;
event.affect = {
    economy: -5, society: -20, environment: +2, income: -50,
};

event.checkOccurCondition = (roomStat) => {
    const playerCount = roomStat?.gameStatus?.length || 0;
    let totalSocietyStatus = 0;
    roomStat.gameStatus.forEach((userStat) => {
        totalSocietyStatus += userStat.status.society;
    });
    if (totalSocietyStatus >= playerCount * 50) return false;
    return true;
};

event.isApplyToUser = (userStatus) => true;
