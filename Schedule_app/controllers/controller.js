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
        res.render('projects', {
            'heading' : 'Dashboard',
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

exports.search = async(req, res) =>{
    try {
        const project = await Project.find({ user: req.user, title: req.body.search }).lean();
        res.render('search', {
            'heading' : 'Search',
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

exports.register = function(req, res) {
    res.render('register', {
        'heading' : 'Register'
    });
}

exports.post_project = async(req, res) =>{

    if(!req.body.title) {
        res.status(400).send("Title required");
        return;
    }
    if(!req.body.module) {
        res.status(400).send("Module required");
        return;
    }
    if(!req.body.due) {
        res.status(400).send("Due date required");
        return;
    }

    try {
        req.body.user = req.user.id;
        await Project.create(req.body);
        req.flash('message', 'Your project has been successfully added!'); 
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
        res.render('500');
    }
}

exports.delete_project = async (req, res) => {

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

    try {
        const date = new Date();

        function convertDate(date) {
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();
          
            var mmChars = mm.split('');
            var ddChars = dd.split('');
          
            return (ddChars[1]?dd:"0"+ddChars[0]) + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + yyyy;
          }

        convertDate(date);

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
        
        const project1 = await Project.find({ _id: req.params.id }).lean();
        var mile = project1[0].milestones;

        var mile1 = mile.replace(/<\/?[^>]+(>|$)/g, "");
        var mile2 = mile1.replace('&nbsp;', '');
        

        await Project.updateOne({ _id: req.params.id }, {milestones: mile2});
        const project = await Project.find({ _id: req.params.id }).lean();
        res.render('viewProject', {
            'heading' : 'View',
            user: req.user.username,
            'name': req.user.username,
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
            'heading' : 'Edit',
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
        res.render('complete', {
            'heading' : 'Complete',
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
        res.render('incomplete', {
            'heading' : 'Incomplete',
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
        res.render('share', {
            'heading' : 'Share',
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
        res.render('shareProject', {
            'heading' : 'Share',
            user: req.user.username,
            project
        })
    } catch (error) {
        console.error(err);
        res.render('500');
    }
}
    