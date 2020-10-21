import i18n from 'i18n';
import { ErrorCodes } from '../../helpers/constants';
import {
    hashPassword, isValidPassword, saveToken, checkIfTokenExist, destroyToken, signToken, userAuthInfo,
    getAccessTokenFromCode, getUserInfoFromAccessToken, getGoogleLoginLink, getUserFromEmailSchema,
} from './authService';
import { getUserDetail } from '../users/userService';
import { respondWithError, logSystemError, respondSuccess } from '../../helpers/messageResponse';

const models = require('../../models');

export async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await models.User.findOne({
            attributes: ['id', 'email', 'fullName', 'birthday', 'password'],
            where: {
                email,
            },
        });
        if (!user) {
            // return user not exist
            return res.json(respondWithError(ErrorCodes.ERROR_CODE_INVALID_USERNAME_OR_PASSWORD, i18n.__('auth.login.wrongEmailOrPassword'), {}));
        }
        if (!isValidPassword(user.password, password)) {
            // return password not correct
            return res.json(respondWithError(ErrorCodes.ERROR_CODE_INVALID_USERNAME_OR_PASSWORD, i18n.__('auth.login.wrongEmailOrPassword'), {}));
        }
        const { token, rToken } = await signToken(user);
        await saveToken(user, rToken);
        // return data
        return res.json(respondSuccess(userAuthInfo(user, token, rToken)));
    } catch (error) {
        return logSystemError(res, error, 'authController - login');
    }
}

export async function refreshToken(req, res) {
    try {
        const { loginUser = {}, refreshToken: oldRefreshToken = null } = req;
        const user = await getUserDetail(loginUser.id);
        if (!user) {
            return res.json(respondWithError(ErrorCodes.ERROR_CODE_UNAUTHORIZED, 'Unauthorized'));
        }
        const isTokenExit = await checkIfTokenExist(user, oldRefreshToken);
        if (!isTokenExit) {
            return res.json(respondWithError(ErrorCodes.ERROR_CODE_UNAUTHORIZED, 'Unauthorized'));
        }

        const { token, rToken } = await signToken(user);
        await Promise.all([destroyToken(isTokenExit.id), saveToken(user, rToken)]);
        return res.json(respondSuccess(userAuthInfo(user, token, rToken)));
    } catch (error) {
        return logSystemError(res, error, 'authController - refreshToken');
    }
}

export async function loginWithGoogle(req, res) {
    try {
        const { code = null, redirectUri = null } = req.body;
        const decodedCode = decodeURIComponent(code);
        const accessToken = await getAccessTokenFromCode(decodedCode, redirectUri);
        if (!accessToken) {
            return res.json(respondWithError(ErrorCodes.ERROR_CODE_UNAUTHORIZED, 'Unauthorized. Cannot get access token'));
        }
        const userInfo = await getUserInfoFromAccessToken(accessToken);
        if (!userInfo) {
            return res.json(respondWithError(ErrorCodes.ERROR_CODE_UNAUTHORIZED, 'Unauthorized. Cannot get user info'));
        }
        const user = await models.User.findOne({
            attributes: ['id', 'email', 'fullName', 'birthday', 'password'],
            where: {
                email: userInfo.email,
            },
        });
        if (!user) {
            return res.json(respondWithError(ErrorCodes.ERROR_CODE_UNAUTHORIZED, i18n.__('auth.login.notAUser'), {}));
        }
        const { token, rToken } = await signToken(user);
        await saveToken(user, rToken);
        // return data
        return res.json(respondSuccess(userAuthInfo(user, token, rToken)));
    } catch (error) {
        return logSystemError(res, error, 'authController - loginWithGoogle');
    }
}

export async function getLoginLink(req, res) {
    try {
        const { redirectUri = null, state = null } = req.query;
        const link = getGoogleLoginLink(redirectUri, state);
        return res.json(respondSuccess({ link, redirectUri }));
    } catch (error) {
        return logSystemError(res, error, 'authController - getLoginLink');
    }
}

export async function getProfile(req, res) {
    try {
        const { loginUser = {} } = req;
        const user = await models.User.findByPk(loginUser.id, {
            attributes: ['id', 'email', 'fullName', 'gender', 'password'],
        });
        return res.json(respondSuccess({
            profile: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                gender: user.gender,
            },
        }));
    } catch (error) {
        return logSystemError(res, error, 'authController - getProfile');
    }
}

export async function updateProfile(req, res) {
    try {
        const { loginUser = {} } = req;
        const {
            fullName, gender,
        } = req.body;
        await models.User.update({
            fullName,
            gender,
        }, {
            where: {
                id: loginUser.id,
            },
        });
        const newProfile = await models.User.findByPk(loginUser.id, {
            attributes: ['id', 'email', 'fullName', 'gender'],
        });
        return res.json(respondSuccess({
            profile: {
                newProfile,
            },
        }));
    } catch (error) {
        return logSystemError(res, error, 'authController - updateProfile');
    }
}
export async function changePassword(req, res) {
    try {
        const { loginUser = {} } = req;
        const {
            oldPassword,
            newPassword,
        } = req.body;
        const currentUser = await models.User.findByPk(loginUser.id);
        if (!isValidPassword(currentUser.password, oldPassword)) {
            return res.json(respondWithError(ErrorCodes.ERROR_CODE_OLD_PASSWORD_NOT_CORRECT, i18n.__('auth.login.oldPasswordIsNotCorrect'), {}));
        }
        await models.User.update({
            password: hashPassword(newPassword),
        }, {
            where: {
                id: loginUser.id,
            },
        });
        return res.json(respondSuccess());
    } catch (error) {
        return logSystemError(res, error, 'authController - changePassword');
    }
}

export async function testFunction(req, res) {
    try {
        console.log(req.body.emailSchema);
        const result = await getUserFromEmailSchema(req.body.emailSchema);
        return res.json(result);
    } catch (error) {
        return logSystemError(res, error, 'authController - changePassword');
    }
}
