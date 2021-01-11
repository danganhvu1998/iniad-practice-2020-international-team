import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'KOVID IS HERE';
event.description = 'KOVID? SHIT HAPPEND AGAIN';
event.occorPossibility = 0.1;
event.affect = {
    economy: -20, society: -10, environment: +10, income: -30,
};

event.checkOccurCondition = (roomStat) => {
    const playerCount = roomStat?.gameStatus?.userStat?.length || 0;
    let totalEconomyStatus = 0;
    roomStat.gameStatus.forEach((userStat) => {
        totalEconomyStatus += userStat.status.economy;
    });
    if (totalEconomyStatus >= playerCount * 50) return false;
    return true;
};

event.isApplyToUser = (userStatus) => {
    if (userStatus.environment < 70) return true;
    return false;
};
