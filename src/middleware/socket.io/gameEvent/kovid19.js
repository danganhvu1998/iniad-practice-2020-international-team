import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'KOVID IS HERE';
event.description = 'See you after the vaccine';
event.occorPossibility = 0.01;
event.affect = {
    economy: -30, society: -25, environment: +2, income: -20,
};

event.checkOccurCondition = (roomStat) => true;

event.isApplyToUser = (userStatus) => true;
