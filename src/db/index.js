const sqlite3 = require('sqlite3').verbose();

// Conectarse a la base de datos SQLite. Si no existe, se crea una nueva en memoria.
// Crear la conexión a la base de datos con el modo OPEN_READWRITE | OPEN_CREATE
const db = new sqlite3.Database('./SDAuth.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

// Utilizar serialize para asegurar operaciones secuenciales en la base de datos
db.serialize(() => {
  // Crear la tabla 'users' si aún no existe.
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      lastname TEXT,
      username TEXT,
      password TEXT
    )`,
    (err) => {
      if (err) {
        console.error('Posiblemente la tabla ya existe.');
      } else {
        console.log('Tabla creada exitosamente!');
      }
    }
  );
});

// Cerrar la base de datos al salir de la aplicación
process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error('Error al cerrar la base de datos:', err.message);
    } else {
      console.log('Base de datos cerrada con éxito.');
    }
  });
});

module.exports = db;