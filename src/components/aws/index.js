const express = require('express');

module.exports = (app) => {
    const router = express.Router();
    app.use('/api/s3-presigned-link', router);
};
