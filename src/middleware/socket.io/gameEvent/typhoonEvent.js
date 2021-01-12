import { event as baseEvent } from './baseEvent';

export const event = { ...baseEvent };

event.name = 'TYPHOON';
event.description = 'Why that a strong wind!';
event.occorPossibility = 0.07;
event.affect = {
    economy: -5, society: 0, environment: -15, income: -2,
};

event.checkOccurCondition = (roomStat) => true;

event.isApplyToUser = (userStatus) => true;
