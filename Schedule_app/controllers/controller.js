const { response } = require('express');
const guestbookDAO = require('../models/model');
const db = new guestbookDAO('./projects.db');

exports.dashboard = function(req, res){
    
    db.getAllProjects().then((list) => {

        res.render('projects', {
            'heading' : 'Projects',
            'date' : new Date(),
            'projects' : list
        });
        console.log('Promise resolved');
    }).catch((err) => {
        console.log('Promise rejected', err);
    })
}

exports.add_project = function(req, res) {
    res.render('addProject');
}

exports.login = function(req, res) {
    res.render('login');
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
    res.redirect('/');
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