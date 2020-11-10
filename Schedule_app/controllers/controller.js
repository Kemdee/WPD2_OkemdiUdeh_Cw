const { response } = require('express');
const guestbookDAO = require('../models/model');
const db = new guestbookDAO('./projects.db');

exports.landing_page = function(req, res){

    res.render('projects', {
        'title' : 'Projects',
        'projects' : [
            {
                'pTitle' : 'Electronic Health records',
            },
            {
                'pTitle' : 'Unify Radio',
            },
            {
                'pTitle' : 'Coursework Scheduling Application',

            }
        ]
    })
    /*
    db.getAllEntries().then((list) => {
        res.render('projects', {
            'title' : 'Projects',
            'projects' : list
        });
        console.log('Promise resolved');
    }).catch((err) => {
        console.log('Promise rejected', err);
    })
    */
}

/*
exports.show_new_entries = function(req, res) {
    res.render('newEntry', {
        'title' : 'Guest Book'
    })
}
*/

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

/*
exports.post_new_entry = function(req, res) {
    console.log('processing post-new_entry controller');

    if (!req.body.author) {
        response.status(400).send('Entries must have an author.');
        return;
    }

    db.addEntry(req.body.author, req.body.subject, req.body.contents);
    res.redirect('/');
}
*/

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