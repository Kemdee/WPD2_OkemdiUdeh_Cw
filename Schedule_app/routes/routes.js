const express = require('express');
const controller = require('../controllers/controller');
const router = express.Router();

router.get("/", controller.dashboard);

router.get('/new', controller.add_project);

router.post('/new', controller.post_project);

router.get('/login', controller.login);

router.get('/remove', controller.remove_project);

router.post('/remove', controller.post_remove);

router.get('/register', controller.register);

//router.get('/posts/:author', controller.show_user_entries);

//router.get('/guestbook', controller.entries_list);

/*
router.get('/about', (req, res) => {
    res.redirect('about.html');
});
*/

//router.get('/peter', controller.peters_entries);

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain')
    res.send('404 Not found');
})

router.use(function(err, req, res, next){
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error');
})

module.exports = router;