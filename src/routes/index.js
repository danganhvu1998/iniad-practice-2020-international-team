const authApiRouter = require('../components/auth');
const userApiRouter = require('../components/users');
const s3ApiRouter = require('../components/aws');

const routerManager = (app) => {
    authApiRouter(app);
    userApiRouter(app);
    s3ApiRouter(app);
};

module.exports = routerManager;
