// Archivo para conectar a la base de datos PostgreSQL usando pg
const { Pool } = require('pg');

// Crear una nueva instancia de Pool para conectarse a la base de datos
// y se habilita ssl porque render lo requiere
const pool = new Pool({
  connectionString: 'postgresql://dbjuntas_user:EBAHSKtIFDS9k02KBvg2L1Br9mqK3pAI@dpg-cvv09q9r0fns739vqbr0-a.virginia-postgres.render.com/dbjuntas',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;