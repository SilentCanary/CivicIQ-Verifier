const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/database.db");

function get_table_schema(table_name) {
    return new Promise((resolve, reject) => {
        db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name=?;", [table_name], (err, table) => {
            if (err || !table) {
                console.error("Error fetching table schema:", err?.message || "Table not found");
                return reject("Failed to retrieve schema");
            }
            resolve(table.sql);
        });
    });
}

module.exports = { get_table_schema };
