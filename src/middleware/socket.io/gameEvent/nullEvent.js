import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'NOTHING HAPPEND';
event.description = 'NOTHING HAPPEND';
event.occorPossibility = 1;
event.affect = {
    economy: 0, society: 0, environment: 0, income: 0,
};

event.checkOccurCondition = (roomStat) => true;

event.isApplyToUser = (userStatus) => true;
