const Database = require("better-sqlite3"); // to import the sqlite library
const path = require("path"); // node path helper

const db = new Database(path.join(__dirname, "tasks.db")); // opens a database file named tasks; if not there, it will make one for you
db.pragma("journal_mode=WAL"); // for better performance

db.exec(`CREATE TABLE IF NOT EXISTS tasks(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL, 
            data TEXT,
            status TEXT DEFAULT 'pending',
            time DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
);

module.exports = db; // makes object db exportable 
