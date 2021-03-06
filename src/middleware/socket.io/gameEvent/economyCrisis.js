import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'ECONOMY CRISIS';
event.description = '1$ is now 0.75$. Oh 0.5 actually';
event.occorPossibility = 0.02;
event.affect = {
    economy: -15, society: -20, environment: 0, income: -30,
};

event.checkOccurCondition = (roomStat) => {
    const playerCount = roomStat?.gameStatus?.length || 0;
    let totalEconomyStatus = 0;
    roomStat.gameStatus.forEach((userStat) => {
        totalEconomyStatus += userStat.status.economy;
    });
    if (totalEconomyStatus >= playerCount * 60) return false;
    return true;
};

event.isApplyToUser = (userStatus) => {
    if (userStatus.economy < 60) return true;
    return false;
};
