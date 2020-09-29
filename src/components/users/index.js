import { authenticate } from '../../middleware/auth';
import { getList, getDetail } from './userController';
import { getUserListValidator } from './userValidator';

const express = require('express');

module.exports = (app) => {
    const router = express.Router();
    router.get('/', authenticate, getUserListValidator, getList);
    router.get('/:id', authenticate, getDetail);
    app.use('/api/user', router);
};
