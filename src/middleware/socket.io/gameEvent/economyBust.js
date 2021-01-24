import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'GREAT ECONOMIC YEAR';
event.description = 'Humm, 15% grow rate.';
event.occorPossibility = 0.01;
event.affect = {
    economy: +15, society: +10, environment: +0, income: +20,
};

event.checkOccurCondition = (roomStat) => true;

event.isApplyToUser = (userStatus) => true;
