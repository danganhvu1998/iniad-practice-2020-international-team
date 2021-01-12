import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'GLOBAL WARMING';
event.description = 'Oh you know what it is';
event.occorPossibility = 0.07;
event.affect = {
    economy: -3, society: -3, environment: -2, income: -2,
};

event.checkOccurCondition = (roomStat) => {
    const playerCount = roomStat?.gameStatus?.length || 0;
    let totalEnvStatus = 0;
    roomStat.gameStatus.forEach((userStat) => {
        totalEnvStatus += userStat.status.environment;
    });
    if (totalEnvStatus >= playerCount * 50) return false;
    return true;
};

event.isApplyToUser = (userStatus) => {
    if (userStatus.environment < 70) return true;
    return false;
};
