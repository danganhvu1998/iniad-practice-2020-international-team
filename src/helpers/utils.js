const moment = require('moment');
const Sequelize = require('sequelize');
const models = require('../models');

const { Op } = Sequelize;
export function formatDate(date) {
    if (date) {
        return moment(date)
            .format('YYYY-MM-DD');
    }
    return '';
}

export function formatDateTime(dateTime) {
    if (!dateTime) return null;
    let formatedDateTime = dateTime.length < 11 ? `${dateTime} 00:00:00+0900` : dateTime;
    formatedDateTime = moment(formatedDateTime).startOf('day');
    return formatedDateTime;
}

export function addFilterByDate(filterValue) {
    let [start = '', end = ''] = filterValue;

    if (!start) start = '1900-01-01 00:00:00';
    else start = `${start} 00:00:00`;
    if (!end) end = '9999-12-31 23:59:59';
    else end = `${end} 23:59:59`;
    return {
        [Op.between]: [start, end],
    };
}

export async function checkUniqueValue(model, query = {}) {
    try {
        const value = await models[model].findOne({
            where: query,
        });
        return !value;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log('checkUniqueValue ', e);
        return false;
    }
}
