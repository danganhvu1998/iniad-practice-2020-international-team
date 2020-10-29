import { logger } from '../../helpers/logger';
import { io } from '../../server';

export function sendGlobleMessage(msg, user) {
    if (msg.startsWith('cmd')) {
        try {
            const cmd = msg.toLowerCase().split(' ');
            switch (cmd[1]) {
            case 'set':
                switch (cmd[2]) {
                case 'name':
                    // eslint-disable-next-line prefer-destructuring
                    user.name = cmd[3];
                    break;
                default:
                    break;
                }
                break;
            default:
                break;
            }
        } catch {
            return 1;
        }
    } else {
        io.emit('newGlobalChatMessage', `${user.name}: ${msg}`);
    }
    return 0;
}
