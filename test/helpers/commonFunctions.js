/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import request from 'supertest';
import app from '../../src/app';
import { ErrorCodes } from '../../src/helpers/constants';
import { Method } from './constants';
import { mockUserCreator } from './mockData';
import { logger } from '../../src/helpers/logger';

export const mockUser = mockUserCreator();

export async function testIfInCorrectResponseFormat(res) {
    const resData = res.body;
    const expectedCode = resData.code;
    expect(resData.message).not.toBeNull();
    if (expectedCode === ErrorCodes.ERROR_CODE_SUCCESS) {
        expect(resData.data).not.toBeNull();
    } else {
        expect(resData.errors).not.toBeNull();
    }
}

async function sendRequest(typeRequest, link, token, data, test = true) {
    let res = {};
    if (typeRequest === Method.GET) {
        if (token == null) {
            res = await request(app).get(link).query(data);
        } else {
            res = await request(app).get(link).set('Authorization', `Bearer ${token}`).query(data);
        }
    } else if (token == null) {
        res = await request(app)[typeRequest](link).send(data);
    } else {
        res = await request(app)[typeRequest](link).set('Authorization', `Bearer ${token}`).send(data);
    }
    if (test) {
        await testIfInCorrectResponseFormat(res);
    }
    res.body.requestLink = link;
    return res.body;
}

/*
function testIfResponseAsExpectedFormat
    + Check if response code is as expected (expectCode)
    + Check if response status and request code are equal
    + Check if response format is as expected
        + Have code, message
        + Have data for success response, errors for fail response
*/

export async function testIfResponseAsExpectedFormat(
    typeRequest,
    link,
    token,
    data,
    expectCode = ErrorCodes.ERROR_CODE_SUCCESS,
) {
    const resBody = await sendRequest(typeRequest, link, token, data);
    if (resBody.code !== expectCode) {
        // eslint-disable-next-line no-console
        console.log('WRONG RESPONSE BODY', { typeRequest, link, resBody });
    }
    expect(resBody.code).toBe(expectCode);
    return resBody;
}

function getCredential(obj) {
    let email = '';
    let password = '';
    email = obj.email;
    password = obj.password;
    return { email, password };
}

// export async function register(
//     userInfo = mockUser,
//     modifyStatus = true,
//     UserStatus = ['manager', 'supervisor', 'driver'],
// ) {
//     NOT USE YET
// }
// login

export async function login(userInfo = null) {
    if (!userInfo) userInfo = mockUser;
    const credential = getCredential(userInfo);
    const res = await request(app).post('/api/login').send(credential);
    return res;
}
// get token after login
export async function getMockToken(userInfo = null) {
    if (!userInfo) userInfo = mockUser;
    try {
        const {
            body: {
                data: {
                    accessToken: { token },
                    refreshToken: { token: rToken },
                },
            },
        } = await login(userInfo);
        return { token, rToken };
    } catch (e) {
        logger.error(`Func: getMockToken ; randCode:  getMockToken error: ${e.message}`);
        return null;
    }
}
