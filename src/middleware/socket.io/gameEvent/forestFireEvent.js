import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'FOREST FIRE';
event.description = 'burn, hot, no!';
event.occorPossibility = 0.02;
event.affect = {
    economy: -3, society: -3, environment: -7, income: -2,
};

event.checkOccurCondition = (roomStat) => true;

event.isApplyToUser = (userStatus) => true;
