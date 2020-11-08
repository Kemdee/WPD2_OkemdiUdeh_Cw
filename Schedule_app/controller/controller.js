const guestbookDAO = require('../model/model');
const db = new guestbookDAO('./Persistence/projects.db');

exports.login = function(req, res) {
    res.sendFile(path.join(public, 'login.html'));
}

/* exports.post_name = function(req, res) {
    console.log('processing user');

    db.addEntry(req.body.name);
    res.redirect('/login/:name');
}
*/

exports.show_projects = function(req, res) {
    res.render('projects');
}

exports.new_project = function(req, res) {
    res.render('newProject');
}

exports.post_new_project = function(req, res) {
    console.log('processing post-new_project controller');

    db.addEntry(req.body.title, req.body.module1, req.body.due);
    res.redirect('/');
}