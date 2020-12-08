const express = require('express');
const controller = require('../controllers/controller');
const {ensureAuthenticated} = require("../config/auth.js")
const router = express.Router();

router.get("/", controller.welcome);

router.get("/dashboard", ensureAuthenticated, controller.dashboard);

router.get('/new', ensureAuthenticated, controller.add_project);

router.post('/new', ensureAuthenticated, controller.post_project);

//router.get('/login', controller.login);

router.get('/project/:id', ensureAuthenticated, controller.view_project);

router.get('/delete/:id', ensureAuthenticated, controller.delete_project);

router.get('/edit/:id', ensureAuthenticated, controller.edit_project);

router.post('/edit/:id', ensureAuthenticated, controller.update_project);

router.get('/complete', ensureAuthenticated, controller.view_completed);

router.get('/incomplete', ensureAuthenticated, controller.view_incomplete);

router.get('/share', ensureAuthenticated, controller.share);

router.get('/share/:id', ensureAuthenticated, controller.share_project);

router.get('/complete/:id', ensureAuthenticated, controller.mark_complete);

router.get('/register', controller.register);

router.use(function(req, res) {
    res.status(404);
    res.render('404');
})

router.use(function(err, req, res, next){
    res.status(500);
    res.render('500');
})

module.exports = router;