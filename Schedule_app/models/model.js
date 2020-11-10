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


    getAllEntries() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function(err, entries) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(entries);
                    console.log("Function all() returns: ", entries);
                }
            })
        })
    }

    addEntry(author, subject, contents) {
        var entry = {
            author: author,
            subject: subject,
            contents: contents,
            published: new Date().toISOString().split('T')[0]
        }
        console.log('entry created', entry);

        this.db.insert(entry, function(err, doc) {
            if (err) {
                console.log('Error inserting document', subject);
            }
            else {
                console.log('document inserted into the database', doc);
            }
        })
    }

    getPetersEntries() {
        return new Promise((resolve, reject) => {
            this.db.find({author: 'Peter'}, function(err, entries) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(entries);
                    console.log('getPetersEntries() returns: ', entries);
                }
            })
        })
    }

    getEntriesByUser(authorName) {
        return new Promise((resolve, reject) => {
            this.db.find({author: authorName}, function(err, entries) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(entries);
                    console.log('getEntriesByUser() returns: ', entries);
                }
            })
        })
    }
};

module.exports = GuestBook;