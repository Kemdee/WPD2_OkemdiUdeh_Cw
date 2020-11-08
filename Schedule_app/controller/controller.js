const guestbookDAO = require('../model/model');
const db = new guestbookDAO('../Persistence/projects.db');

exports.dashboard = function(req, res) {
    res.send('Welcome to my application');
}