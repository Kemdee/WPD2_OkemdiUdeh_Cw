const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

//login handle
router.get('/login', controller.user_login);

router.get('/register',(req,res)=>{
    res.render('register')
})
//Register handle
router.post('/register', controller.user_post_register);

router.post('/login', controller.user_post_login);

//logout
router.get('/logout', controller.user_logout);

router.use(function(req, res) {
    res.status(404);
    res.render('404');
})

router.use(function(err, req, res, next){
    res.status(500);
    res.render('500');
})

module.exports  = router;