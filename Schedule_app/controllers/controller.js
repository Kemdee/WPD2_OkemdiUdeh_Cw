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
            'alert' : res.locals.message,
            'project' : project
        })
    } catch(err) {
        console.error(err);
        res.render('500');
    }
}

exports.add_project = function(req, res) {
    
    res.render('addProject', {
        'heading' : 'New',
        user: req.user.username
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

exports.post_project = async(req, res) =>{
    console.log('processing post_project controller');

    try {
        req.body.user = req.user.id;
        await Project.create(req.body);
        req.flash('message', 'Your project has been successfully added!'); 
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
        res.render('500');
    }
    if(!req.body.title) {
        res.status(400).send("Coursework Title required");
        return;
    }
    if(!req.body.milestones) {
        res.status(400).send("Milestone required");
        return;
    }
}

exports.delete_project = async (req, res) => {
    console.log('Deleting coursework');
    try {
        await Project.deleteOne({ _id: req.params.id });
        req.flash('message', 'Your project has been successfully removed!'); 
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
        res.render('500');
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
        req.flash('message', 'Congratulations on completing your project!'); 
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
        res.render('500');
    }
}

exports.view_project = async (req, res) => {
    try {
        const project = await Project.find({ _id: req.params.id }).lean();
        res.render('viewProject', {
            user: req.user.username,
            project
        })
    } catch (error) {
        console.error(err);
        res.render('500');
    }
}

exports.edit_project = async (req, res) => {
    try {
        const project = await Project.find({ _id: req.params.id }).lean();
        res.render('editProject', {
            user: req.user.username,
            project
        })
    } catch (error) {
        console.error(err);
        res.render('500');
    }
}

exports.update_project = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        project = await Project.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
    });
    req.flash('message', 'Your project has been successfully updated!'); 
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
        res.render('500');
    }
}

exports.view_completed = async(req, res) => {
    try {
        const project = await Project.find({ user: req.user, status:"Complete" }).lean();
        console.log(project);
        res.render('complete', {
            'heading' : 'Projects',
            'date' : new Date(),
            user: req.user.username,
            'project' : project
        })
    } catch(err) {
        console.error(err);
        res.render('500');
    }
}

exports.view_incomplete = async(req, res) => {
    try {
        const project = await Project.find({ user: req.user, status:"In Progress" }).lean();
        console.log(project);
        res.render('incomplete', {
            'heading' : 'Projects',
            'date' : new Date(),
            user: req.user.username,
            'project' : project
        })
    } catch(err) {
        console.error(err);
        res.render('500');
    }
}

exports.share = async(req, res) => {
    try {
        const project = await Project.find({ user: req.user }).lean();
        console.log(project);
        res.render('share', {
            'heading' : 'Projects',
            'date' : new Date(),
            user: req.user.username,
            'project' : project
        })
    } catch(err) {
        console.error(err);
        res.render('500');
    }
}

exports.share_project = async (req, res) => {
    try {
        const project = await Project.find({ _id: req.params.id }).lean();
        console.log(project);
        res.render('shareProject', {
            user: req.user.username,
            project
        })
    } catch (error) {
        console.error(err);
        res.render('500');
    }
}
    