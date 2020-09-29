import config from 'config';
import axios from 'axios';
import queryString from 'query-string';
import { logger } from '../../helpers/logger';

const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../../models');

const SECRET_ACCESS_TOKEN = config.get('auth.secret_access_token');
const SECRET_ACCESS_TOKEN_EXPIRE = config.get('auth.secret_access_token_expire');
const SECRET_REFRESH_ACCESS_TOKEN = config.get('auth.secret_refresh_access_token');
const SECRET_REFRESH_ACCESS_TOKEN_EXPIRE = config.get('auth.secret_refresh_access_token_expire');
const GOOGLE_CLIENT_AUTH = config.get('google_authentication');

export function isValidPassword(userpass, password) {
    return bCrypt.compareSync(password, userpass);
}
export function hashPassword(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
}

export async function saveToken(user, token, type = 'refresh_token') {
    try {
        const tokenDate = {
            userId: user.id,
            email: user.email,
            type,
            token,
        };
        const newToken = await models.UserToken.create(tokenDate);
        return newToken;
    } catch (e) {
        logger.error(`Error in saveRefreshToken ${e.message}`);
        throw e;
    }
}

export async function destroyToken(tokenId) {
    try {
        await models.UserToken.destroy({
            where: {
                id: tokenId,
            },
        });
        return {
            success: true,
        };
    } catch (e) {
        logger.error(`Error in saveRefreshToken ${e.message}`);
        throw e;
    }
}

export async function checkIfTokenExist(user, token, type = 'refresh_token') {
    try {
        const tokenData = await models.UserToken.findOne({
            attributes: ['id'],
            where: {
                token,
                type,
                userId: user.id,
                email: user.email,
            },
        });
        return tokenData;
    } catch (e) {
        logger.error(`Error in checkIfTokenExist ${e.message}`);
        throw e;
    }
}

export async function signToken(user) {
    try {
        // sign token
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_ACCESS_TOKEN, {
            expiresIn: SECRET_ACCESS_TOKEN_EXPIRE,
        });
        const rToken = jwt.sign({ id: user.id, email: user.email }, SECRET_REFRESH_ACCESS_TOKEN, {
            expiresIn: SECRET_REFRESH_ACCESS_TOKEN_EXPIRE,
        });
        return { token, rToken };
    } catch (e) {
        logger.error(`Error in signToken ${e.message}`);
        throw e;
    }
}

export function userAuthInfo(user, token, rToken) {
    const tokenExpiredAt = new Date();
    tokenExpiredAt.setSeconds(tokenExpiredAt.getSeconds() + +SECRET_ACCESS_TOKEN_EXPIRE);
    const refreshTokenExpiredAt = new Date();
    refreshTokenExpiredAt.setSeconds(tokenExpiredAt.getSeconds() + +SECRET_REFRESH_ACCESS_TOKEN_EXPIRE);
    // return data
    return {
        accessToken: {
            token,
            expiresIn: SECRET_ACCESS_TOKEN_EXPIRE,
            expiredAt: tokenExpiredAt.getTime(),
        },
        refreshToken: {
            token: rToken,
            expiresIn: SECRET_REFRESH_ACCESS_TOKEN_EXPIRE,
            expiredAt: refreshTokenExpiredAt.getTime(),
        },
        profile: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            birthday: user.birthday,
        },
    };
}

export async function getAccessTokenFromCode(code, reredirectUri) {
    try {
        const { data } = await axios({
            url: 'https://oauth2.googleapis.com/token',
            method: 'post',
            data: {
                ...GOOGLE_CLIENT_AUTH,
                redirect_uri: reredirectUri,
                grant_type: 'authorization_code',
                code,
            },
        });
        // eslint-disable-next-line camelcase
        return data?.access_token || null;
    } catch (e) {
        if (e.response.status === 400) return null;
        logger.error(`Error in getAccessTokenFromCode ${e.message}`);
        throw e;
    }
}

export async function getUserInfoFromAccessToken(accessToken) {
    try {
        const { data } = await axios({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return data;
    } catch (e) {
        if (e.response.status === 400) return null;
        logger.error(`Error in getUserInfoFromAccessToken ${e.message}`);
        throw e;
    }
}

export function getGoogleLoginLink(
    redirectUri, state,
    scope = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ],
    responseType = 'code',
    accessType = 'offline',
    prompt = 'consent',
) {
    try {
        const stringifiedParams = queryString.stringify({
            client_id: GOOGLE_CLIENT_AUTH.client_id,
            redirect_uri: redirectUri,
            scope: scope.join(' '), // space seperated string
            response_type: responseType,
            access_type: accessType,
            prompt,
            state,
        });
        const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
        return googleLoginUrl;
    } catch (e) {
        logger.error(`Error in getGoogleLoginLink ${e.message}`);
        throw e;
    }
}
