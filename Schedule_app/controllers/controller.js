const { response } = require('express');
const guestbookDAO = require('../models/model');
const db = new guestbookDAO('./projects.db');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');


exports.welcome = function(req, res) {
    res.render('welcome', {
        'heading' : 'To-Do'
    });
}

exports.user_login = function(req, res) {
    res.render('login', {
        'heading' : 'Login',
        'alert1' : res.locals.success_msg,
        'alert2' : res.locals.error_msg,
        'alert3' : res.locals.error
    });
}

exports.user_post_register = function(req, res) {

    const {username,email, password, password2} = req.body;
    let errors = [];
    console.log(' Username ' + username+ ' email :' + email+ ' pass:' + password);
    
    if(!username || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }    
    //check if password is more than 6 characters
    else if(password.length < 6 ) {
        errors.push({msg : 'Password must be at least 6 characters'})
    }
    //check if match
    else if(password !== password2) {
        errors.push({msg : "Passwords don't match"});
    }
    else {
        console.log('No errors');
    }

    if(errors.length > 0 ) {
        res.render('register', {
            'heading' : 'Register',
            'errors' : errors
            })
    } else {
        //validation passed
        User.findOne({email : email}).exec((err,user)=>{
            console.log(user);   
            if(user) {
                errors.push({msg: 'Email already registered'});
                res.render('register', {
                    'heading' : 'Register',
                    'errors' : errors
                    })
            } else {
                const newUser = new User({
                    username : username,
                    email : email,
                    password : password
                });
                //hash password
                bcrypt.genSalt(10,(err,salt)=> 
                bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                        //save user
                        newUser.save()
                        .then((value)=>{
                        console.log(value)
                        req.flash('success_msg','You have now registered!')
                        res.redirect('/users/login');
                    })
                    .catch(value=> console.log(value));
                      
                }));
            }
        })
    }
}

exports.user_post_login = function(req, res, next) {
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true,
    })(req,res,next);
}

exports.user_logout = function(req, res) {
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/users/login');
}

exports.dashboard = function(req, res){
    
    db.getAllProjects().then((list) => {

        res.render('projects', {
            'heading' : 'Projects',
            'user' : req.user.username,
            'date' : new Date(),
            'projects' : list
        });
        console.log('Promise resolved');
    }).catch((err) => {
        console.log('Promise rejected', err);
    })
}

exports.add_project = function(req, res) {
    res.render('addProject', {
        'heading' : 'New'
    });
}

// exports.login = function(req, res) {
//     res.render('login');
// }

exports.register = function(req, res) {
    res.render('register', {
        'heading' : 'Register'
    });
}

exports.remove_project = function(req, res) {
    res.render('removeProject', {
        'heading' : 'Remove'
    });
}

exports.post_remove = function(req, res) {
    console.log('processing remove_project controller')

    db.removeProject(req.body.title);
    res.redirect('/dashboard');
}
/*
exports.show_user_entries = function(req, res) {
    console.log('filtering author name', req.params.author);

    let user = req.params.author;
    db.getEntriesByUser(user).then((entries) => {
        res.render('entries', {
            'title': 'Guest Book',
            'entries': entries
        });
    }).catch((err) => {
        console.log('error handling author posts', err);
    });
}
*/

exports.post_project = function(req, res) {
    console.log('processing post_project controller');

    db.addProject(req.body.title, req.body.module, req.body.due);
    res.redirect('/dashboard');
}

/*
exports.new_entry = function(req, res){
    res.send('<h1>Not yet implemented: show a new entry page</h1>');
}
*/

/*
exports.peters_entries = function(req, res){
    res.send('<h1>Processing Peter\'s Entries, see terminal</h1>');
    db.getPetersEntries();
}
*/
    