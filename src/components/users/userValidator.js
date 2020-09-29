import { respondWithError } from '../../helpers/messageResponse';
import { ErrorCodes } from '../../helpers/constants';

const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');

const Joi = BaseJoi.extend(Extension);

const getUserListValidSchema = Joi.object().keys({
    limit: Joi.number().integer().allow(null),
    page: Joi.number().integer().allow(null),
    keyword: Joi.string().allow(null).allow(''),
    role: Joi.string().valid('admin', 'supervisor', 'school_manager', 'teacher').allow(null),
    userType: Joi.array().items(Joi.string().valid('admin', 'supervisor', 'school_manager', 'teacher')),
});

export async function getUserListValidator(req, res, next) {
    const { query } = req;

    const result = Joi.validate(query, getUserListValidSchema);

    if (result.error) {
        res.json(respondWithError(ErrorCodes.ERROR_CODE_INVALID_PARAMETER, result.error.message, result.error.details));
        return;
    }
    next();
}
