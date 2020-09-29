import { logger } from '../../helpers/logger';

const Sequelize = require('sequelize');

const { Op } = Sequelize;

const models = require('../../models');

const userAttributes = ['id', 'fullName', 'email', 'birthday', 'gender'];

// get list of user
export async function fetchUserList(filter) {
    try {
        const {
            keyword = '', page = 0, limit = 10, role = null, schoolId = null, userType = [],
        } = filter;
        const offset = +limit * +page;
        const query = {
            attributes: userAttributes,
            offset,
            limit: +limit,
            order: [['createdAt', 'desc']],
        };
        const userWhere = {
            [Op.or]: {
                fullName: {
                    [Op.like]: `%${keyword}%`,
                },
                email: {
                    [Op.like]: `%${keyword}%`,
                },
            },
        };

        if (role) userWhere.role = role;
        if (schoolId) userWhere.schoolId = schoolId;
        if (Array.isArray(userType) && userType?.length) userWhere.role = { [Op.in]: userType };

        query.where = userWhere;
        const rawData = await models.User.findAndCountAll(query);
        return rawData;
    } catch (e) {
        logger.error(`Error in fetchUserList ${e.message}`);
        throw e;
    }
}

// get user detail
export async function getUserDetail(id) {
    try {
        const user = await models.User.findByPk(id, {
            attributes: userAttributes,
        });
        return user;
    } catch (e) {
        logger.error(`Error in getUserDetail ${e.message}`);
        throw e;
    }
}
