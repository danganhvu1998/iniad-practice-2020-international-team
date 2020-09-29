import winston from 'winston';
import path from 'path';

const DailyRotateFile = require('winston-daily-rotate-file');

export function customLogger(customFile = 'job') {
    return winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
            new winston.transports.Console({
                level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
            }),
            // - Write to all logs with level `debug` and below and rotate by day
            new DailyRotateFile({
                level: 'debug',
                name: 'file',
                datePattern: 'yyyy-MM-DD',
                filename: path.join(__dirname, '../../logs', `shozemi_${customFile}.log`),
            }),
        ],
    });
}

export const logger = customLogger('general');

if (process.env.NODE_ENV !== 'production') {
    logger.debug('Logging initialized at debug level');
}
