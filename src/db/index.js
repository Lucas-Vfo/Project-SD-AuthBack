const sqlite3 = require('sqlite3').verbose();

// Conectarse a la base de datos SQLite. Si no existe, se crea una nueva en memoria.
// Pueden utilizar un string con una ruta para crear un archivo o el string ':memory:' para crear una base de datos temporal en memoria.
const db = new sqlite3.Database('./SDAuth.sqlite', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }

  console.log('Conectado a la base de datos SQLite.');

  // Crear la tabla 'users' si aún no existe.
  db.run(
    `CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text,
    lastname text,
    email,
    username text, 
    password text
    )`,
    (err) => {
      if (err) {
        console.log('Posiblemente la tabla ya existe.');
      } else {
        console.log('Tabla creada exitosamente!');
      }
    }
  );
});

module.exports = db;