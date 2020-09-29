import { v4 as uuidv4 } from 'uuid';
import config from 'config';
import axios from 'axios';
import { logger } from './logger';
import { ErrorCodes } from './constants';

const slackAlarm = config.get('slack_alarm');

export async function sendAlarmToSlack(message) {
    if (slackAlarm && !slackAlarm.isDev) {
        try {
            // eslint-disable-next-line max-len
            const messageText = `\`\`\`time: ${new Date()}\nid: ${message.id}\nmessage: ${message.message}\nidentity: ${slackAlarm?.identity || 'unknown'}\nfunction: ${message.functionName}\`\`\``;
            await axios({
                url: slackAlarm.postWebhook,
                method: 'post',
                data: { text: messageText },
            });
        } catch (e) {
            logger.error(`Error in sendAlarmToSlack ${e.message}`);
        }
    }
}

export function respondSuccess(data, message = 'Success') {
    return {
        code: ErrorCodes.ERROR_CODE_SUCCESS,
        message,
        data,
    };
}

export function respondWithError(errorCode, message = 'Error', data = {}) {
    return {
        code: errorCode,
        message,
        errors: data,
    };
}

export function logSystemError(res, error, functionName) {
    const errorObj = {};
    errorObj.id = `${Date.now()}-${uuidv4()}`;
    errorObj.message = error.message;
    errorObj.stack = error.stack;
    errorObj.functionName = functionName;
    logger.error(`Error in ${functionName}: ${JSON.stringify(errorObj)}`);
    sendAlarmToSlack(errorObj);
    return res.json(respondWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, `SYSTEM_ERROR: ${errorObj.id}`));
}
