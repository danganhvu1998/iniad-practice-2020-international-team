import { authenticate } from '../../middleware/auth';
import {
    login, getProfile, updateProfile, changePassword, refreshToken, loginWithGoogle, getLoginLink,
    testFunction,
} from './authController';
import {
    loginValidator, profileValidator, passwordValidator, googleLoginValidator, getLoginLinkValidator,
    testFunctionValidator,
} from './authValidator';

const express = require('express');

module.exports = (app) => {
    const router = express.Router();
    router.post('/test-api', testFunctionValidator, testFunction);
    // When POST to /api/test-api, first call testFunctionValidator then testFunction. In testFunction (in authController),
    // it will call a function in authService to connect to mysql via models
    router.post('/login', loginValidator, login);
    router.post('/google-login', googleLoginValidator, loginWithGoogle);
    router.post('/refresh-token', (req, res, next) => { req.authorization_type = 'refresh'; next(); }, authenticate, refreshToken);
    router.get('/profile', authenticate, getProfile);
    router.get('/google-login-link', getLoginLinkValidator, getLoginLink);
    router.post('/profile', authenticate, profileValidator, updateProfile);
    router.post('/profile/change-password', authenticate, passwordValidator, changePassword);
    app.use('/api', router);
};
