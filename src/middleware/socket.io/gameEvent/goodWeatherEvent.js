import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'WEATHER IS GREAT';
event.description = 'Tree grow way faster';
event.occorPossibility = 0.05;
event.affect = {
    economy: +2, society: 3, environment: +5, income: +2,
};

event.checkOccurCondition = (roomStat) => true;

event.isApplyToUser = (userStatus) => {
    if (userStatus.environment < 50) return false;
    return false;
};
