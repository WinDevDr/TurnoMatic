const sqlite3 = require('sqlite3').verbose();

// Initialize the SQLite database
const db = new sqlite3.Database('turnomatics.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tables
const createTurnosTable = `CREATE TABLE IF NOT EXISTS turnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    fecha TEXT NOT NULL,
    area_id INTEGER,
    FOREIGN KEY(area_id) REFERENCES areas(id)
);`;

const createAreasTable = `CREATE TABLE IF NOT EXISTS areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);`;

const createConfiguracionTable = `CREATE TABLE IF NOT EXISTS configuracion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clave TEXT NOT NULL,
    valor TEXT NOT NULL
);`;

const createUsuariosTable = `CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);`;

// Execute table creation queries
db.serialize(() => {
    db.run(createTurnosTable);
    db.run(createAreasTable);
    db.run(createConfiguracionTable);
    db.run(createUsuariosTable);
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing the database ' + err.message);
    } else {
        console.log('Database connection closed.');
    }
});
