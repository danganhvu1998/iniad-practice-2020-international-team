import { Op } from 'sequelize';
import bCrypt from 'bcrypt';
import { logger } from './logger';

export async function checkIfValueExist(model, value, field = 'id', params = {}) {
    try {
        if (!value) return 1; // if undefined
        const {
            excludeField = null, excludeValues = [], attributes = ['id'], paranoid = false,
        } = params;
        const whereValue = excludeField
            ? { [field]: value, [excludeField]: { [Op.notIn]: excludeValues } }
            : { [field]: value };
        return await model.findOne({ attributes, where: whereValue, paranoid });
    } catch (e) {
        logger.error(`----> Error in checkIfValueExist ${e.message}`);
        throw e;
    }
}

export async function updateDataAfterDelete(model, field, currentValue, afterDeleteValie = null) {
    try {
        return await model.update({ [field]: afterDeleteValie }, { where: { [field]: currentValue } });
    } catch (e) {
        logger.error(`----> Error in updateDataAfterDelete ${e.message}`);
        throw e;
    }
}

export function encryptPassword(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function getRandomString(length = 6, chars = 'QWERTYUIOPASDFGHJKLZXCVBNM') {
    let res = '';
    for (let i = 0; i < length; i += 1) {
        res += chars[getRandomInt(chars.length)];
    }
    return res;
}
