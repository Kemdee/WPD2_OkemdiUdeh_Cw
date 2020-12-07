const { response } = require('express');
const User = require("../models/user");
const Project = require("../models/project");
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

exports.dashboard = async(req, res) =>{

    try {
        const project = await Project.find({ user: req.user }).lean();
        console.log(project);
        res.render('projects', {
            'heading' : 'Projects',
            'date' : new Date(),
            user: req.user.username,
            'project' : project
        })
    } catch(err) {
        console.error(err);
    }
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

exports.post_project = function(req, res) {
    console.log('processing post_project controller');

    try {
        req.body.user = req.user.id;
        Project.create(req.body);
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
    }
    if(!req.body.title) {
        res.status(400).send("Coursework Title required");
        return;
    }
}

exports.delete_project = async (req, res) => {
    console.log('Deleting coursework');
    try {
        await Project.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
    
    }
}

exports.mark_complete = async (req, res) => {
    console.log('Changing status');
    try {
        const date = new Date();

        function convertDate(date) {
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();
          
            var mmChars = mm.split('');
            var ddChars = dd.split('');
          
            return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
          }

        convertDate(date);
        console.log(convertDate(date));

        await Project.updateOne({ _id: req.params.id }, {status: 'Complete', completion: convertDate(date)});
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
    
    }
}

    