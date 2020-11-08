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
}

module.exports = GuestBook