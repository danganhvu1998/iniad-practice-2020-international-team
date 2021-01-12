import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'FOREST FIRE';
event.description = 'burn, hot, no!';
event.occorPossibility = 0.03;
event.affect = {
    economy: -3, society: -3, environment: -20, income: -2,
};

event.checkOccurCondition = (roomStat) => true;

event.isApplyToUser = (userStatus) => true;
