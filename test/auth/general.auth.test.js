/* eslint-disable no-console */
/* eslint-disable max-len */
import { Method, adminUser } from '../helpers/constants';
import { ErrorCodes } from '../../src/helpers/constants';
import {
    getMockToken, testIfResponseAsExpectedFormat,
} from '../helpers/commonFunctions';

let adminValidToken = '';
let adminValidRToken = '';

describe('Test login', () => {
    it('should return 200 OK - If not, should re-migrate', async () => {
        const { token, rToken } = await getMockToken(adminUser);
        adminValidToken = token;
        adminValidRToken = rToken;
        expect(token).not.toBeNull();
    });
});

describe('POST /api/profile', () => {
    it(`valid update info, should return ${ErrorCodes.ERROR_CODE_SUCCESS} OK`, async () => {
        const updateInfo = {
            fullName: 'Brand New Full Name',
            gender: 'female',
        };
        const res = await testIfResponseAsExpectedFormat(
            Method.POST,
            '/api/profile',
            adminValidToken,
            updateInfo,
            ErrorCodes.ERROR_CODE_SUCCESS,
        );
        expect(res.data.profile.newProfile.fullName).toBe(updateInfo.fullName);
    });
});

describe('POST /api/refresh-token', () => {
    it('should return 200 OK', async () => {
        const res = await testIfResponseAsExpectedFormat(Method.POST, '/api/refresh-token', adminValidRToken, {});
        console.log(res);
        adminValidToken = res.data.accessToken.token; // New one, all following test should work as normal as well
        await testIfResponseAsExpectedFormat(Method.GET, '/api/profile', adminValidToken, {});
    });
});

describe('POST /api/profile/change-password', () => {
    it('should return 200 OK', async () => {
        const updatePasswordInfo = {
            oldPassword: adminUser.password,
            newPassword: 'changedPass',
        };
        await testIfResponseAsExpectedFormat(Method.POST, '/api/profile/change-password', adminValidToken, updatePasswordInfo);
    });
    it('should return 200 OK', async () => {
        const updatePasswordInfo = {
            oldPassword: 'changedPass',
            newPassword: adminUser.password,
        };
        await testIfResponseAsExpectedFormat(Method.POST, '/api/profile/change-password', adminValidToken, updatePasswordInfo);
    });
    it('should return 405', async () => {
        const updatePasswordInfo = {
            oldPassword: 'wrongPassword',
            newPassword: adminUser.password,
        };
        await testIfResponseAsExpectedFormat(
            Method.POST,
            '/api/profile/change-password',
            adminValidToken,
            updatePasswordInfo,
            ErrorCodes.ERROR_CODE_OLD_PASSWORD_NOT_CORRECT,
        );
    });
});
