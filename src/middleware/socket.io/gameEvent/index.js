import { event as economyCrisisEvent } from './economyCrisis';
import { event as kovidEvent } from './kovid19';
import { event as nullEvent } from './nullEvent';

export const eventsList = [
    economyCrisisEvent,
    kovidEvent,
    // TODO: REMOVE null event later
    nullEvent,
];
