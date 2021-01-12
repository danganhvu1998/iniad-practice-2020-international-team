import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'TYPHOON';
event.description = 'Wow that a strong wind!';
event.occorPossibility = 0.02;
event.affect = {
    economy: -5, society: -5, environment: -7, income: -2,
};

event.checkOccurCondition = (roomStat) => true;

event.isApplyToUser = (userStatus) => true;
