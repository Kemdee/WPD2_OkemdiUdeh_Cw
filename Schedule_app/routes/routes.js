const express = require('express');
const controller = require('../controller/controller');
const router = express.Router();

router.get('/', controller.dashboard);

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 not found');
})

router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res,send('Internal server error');
})

module.exports = router;