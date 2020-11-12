const nedb = require('nedb');

class GuestBook {

    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({filename: dbFilePath, autoload: true});
            console.log('Db connected to ' + dbFilePath);
        }
        else {
            this.db = new nedb();
        }
    }

    getAllProjects() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function(err, projects) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(projects);
                    console.log("Function all() returns: ", projects);
                }
            })
        })
    }

    addProject(title, module, due) {
        var project = {
            title: title,
            module: module,
            due: due
        }
        console.log('project created', project);

        this.db.insert(project, function(err, doc) {
            if (err) {
                console.log('Error inserting document', err);
            }
            else {
                console.log('document inserted into the database', doc);
            }
        })
    }

    removeProject(title) {
        this.db.remove({'title': title}, function(err, doc) {
            if (err) {
                console.log('Error deleting document', err);
            }
            else {
                console.log('document deleted from the database', doc);
            }
        })
    }
};

module.exports = GuestBook;