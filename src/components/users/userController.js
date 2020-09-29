import i18n from 'i18n';
import models from '../../models';
import { ErrorCodes } from '../../helpers/constants';
import { checkIfValueExist } from '../../helpers/commonFunctions';
import {
    respondSuccess,
    respondWithError,
    logSystemError,
} from '../../helpers/messageResponse';
import { fetchUserList, getUserDetail } from './userService';

export async function getList(req, res) {
    try {
        const rawData = await fetchUserList(req.query);
        return res.json(
            respondSuccess({ items: rawData.rows, totalItems: rawData.count }),
        );
    } catch (error) {
        return logSystemError(res, error, 'userController - getList');
    }
}

export async function getDetail(req, res) {
    try {
        const { id } = req.params;
        const isUserExist = await checkIfValueExist(models.User, id);
        if (!isUserExist) {
            return res.json(respondWithError(ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST, i18n.__('user.userDoesNotExist'), {}));
        }
        const user = await getUserDetail(id);
        return res.json(respondSuccess(user));
    } catch (error) {
        return logSystemError(res, error, 'userController - getDetail');
    }
}
