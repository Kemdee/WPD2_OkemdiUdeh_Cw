const express = require('express');
const controller = require('../controller/controller');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('login.html');
});

//router.post('/', controller.post_name);

router.get('/projects', controller.show_projects);

router.get('/new', controller.new_project);

router.post('/new', controller.post_new_project);

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 not found');
})

router.use(function(err, req, res, next){
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error');
})

module.exports = router;