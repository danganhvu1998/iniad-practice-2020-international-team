import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'KOVID IS HERE';
event.description = 'See you after the vaccine';
event.occorPossibility = 0.03;
event.affect = {
    economy: -30, society: -20, environment: +2, income: -50,
};

event.checkOccurCondition = (roomStat) => true;

event.isApplyToUser = (userStatus) => true;
