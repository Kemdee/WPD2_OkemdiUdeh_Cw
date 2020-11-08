const nedb = require('nedb');

class GuestBook {

    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({filename: dbFilePath, autoload:true});
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
/*
    addEntry(name) {
        var entry = {
            name: name 
        }
        console.log('entry created', entry);

        this.db.insert(entry, function(err, doc) {
            if (err) {
                console.log('Error inserting document', err);
            }
            else {
                console.log('document inserted into the database', doc);
            }
        })
    }
    */

   addEntry(title, module, due) {
    var entry = {
        title: title,
        module: module1,
        due: due,
    }
    console.log('entry created', entry);

    this.db.insert(entry, function(err, doc) {
        if (err) {
            console.log('Error inserting document', err);
        }
        else {
            console.log('document inserted into the database', doc);
        }
    })
}
}

module.exports = GuestBook