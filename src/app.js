import { respondWithError } from './helpers/messageResponse';
import { sendAllGameStatsToRooms } from './middleware/socket.io/game';

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const i18n = require('./middleware/i18n');
const routerManager = require('./routes');
require('./models');

sendAllGameStatsToRooms();

const app = express();

app.use(helmet());
app.use(i18n);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// cors  configuration
const corsOptions = {
    origin: '*',
    methods: '*',
    exposedHeaders: '*',

};

app.use(cors(corsOptions));

// log configuration
const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, '../logs'),
});

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));
routerManager(app);

app.use(express.static(path.join(__dirname, '../public')));

// error handler
const { ErrorCodes } = require('./helpers/constants');

// 404 error
app.use((req, res) => {
    res.json(respondWithError(ErrorCodes.ERROR_CODE_API_NOT_FOUND, 'API not found'));
});
// 500 error
app.use((err, req, res) => {
    // eslint-disable-next-line no-console
    console.log(`500 error: ${err.message}`);
    res.json(respondWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, `System error: ${err.message}`, err));
});

module.exports = app;
