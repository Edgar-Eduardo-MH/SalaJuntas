// Archivo que contiene las rutas y la lógica del servicio de salas
const express = require('express');
// Conexión a PostgreSQL
const pool = require('./db');
const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Ruta para crear la tabla "salas"
app.get('/crear-tabla', async (req, res) => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS salas (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          capacidad INT NOT NULL,
          ubicacion TEXT,
          disponible BOOLEAN DEFAULT TRUE
        );
      `);
      res.send('Tabla "salas" creada o ya existente.');
    } catch (err) {
      console.error('Error creando la tabla:', err.message);
      res.status(500).send('Error creando la tabla.');
    }
  });
  
  // Ruta para obtener todas las salas
  app.get('/salas', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM salas ORDER BY nombre');
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener salas:', err.message);
      res.status(500).send('Error al obtener salas');
    }
  });

  // Ruta para obtener una sala por ID
  app.get('/salas/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM salas WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).send('Sala no encontrada');
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener la sala');
    }
  });

  // Ruta para crear una nueva sala
  app.post('/salas', async (req, res) => {
    const { nombre, capacidad, ubicacion } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO salas (nombre, capacidad, ubicacion) VALUES ($1, $2, $3) RETURNING *',
        [nombre, capacidad, ubicacion]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error al crear la sala:', err.message);
      res.status(500).send('Error al crear la sala');
    }
  });
  
  // Ruta para actualizar una sala
  app.put('/salas/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, ubicacion, capacidad } = req.body;

    try {
      await pool.query(
        'UPDATE salas SET nombre = $1, ubicacion = $2, capacidad = $3 WHERE id = $4',
        [nombre, ubicacion, capacidad, id]
      );
      res.send('Sala actualizada correctamente');
    } catch (err) {
      console.error('Error al actualizar sala:', err.message);
      res.status(500).send('Error al actualizar sala');
    }
  });

  // Ruta para eliminar una sala
  app.delete('/salas/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM salas WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return res.status(404).send('Sala no encontrada');
      res.send('Sala eliminada correctamente');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al eliminar la sala');
    }
  });

  // Ruta para crear la tabla "reservas"
  app.get('/crear-tabla-reservas', async (req, res) => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reservas (
          id SERIAL PRIMARY KEY,
          sala_id INT REFERENCES salas(id),
          fecha DATE NOT NULL,
          hora_inicio TIME NOT NULL,
          hora_fin TIME NOT NULL,
          creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      res.send('Tabla "reservas" creada o ya existente.');
    } catch (err) {
      console.error('Error creando la tabla reservas:', err.message);
      res.status(500).send('Error creando la tabla reservas.');
    }
  });
  
  // Ruta para reserver una sala con sus validaciones
  app.post('/reservas', async (req, res) => {
    const { sala_id, fecha, hora_inicio, hora_fin } = req.body;
  
    // Validar duración
    const start = new Date(`${fecha}T${hora_inicio}`);
    const end = new Date(`${fecha}T${hora_fin}`);
    const diffHoras = (end - start) / (1000 * 60 * 60);
  
    if (diffHoras <= 0 || diffHoras > 2) {
      return res.status(400).send('La reserva debe durar más de 0 y como máximo 2 horas');
    }
  
    try {
      // Verificar si ya hay una reserva para la misma sala y hora
      const conflicto = await pool.query(`
        SELECT * FROM reservas
        WHERE sala_id = $1 AND fecha = $2
          AND (
            (hora_inicio < $4 AND hora_fin > $3)  -- traslape
          )
      `, [sala_id, fecha, hora_inicio, hora_fin]);
  
      if (conflicto.rows.length > 0) {
        return res.status(409).send('La sala ya está reservada en ese horario');
      }
  
      // Insertar nueva reserva
      const result = await pool.query(`
        INSERT INTO reservas (sala_id, fecha, hora_inicio, hora_fin)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `, [sala_id, fecha, hora_inicio, hora_fin]);
  
      res.status(201).json(result.rows[0]);
  
    } catch (err) {
      console.error('Error al crear la reserva:', err.message);
      res.status(500).send('Error al crear la reserva');
    }
  });

  //Ruta para obtener todas las reservas
  app.get('/reservas', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT r.*, s.nombre AS sala_nombre
        FROM reservas r
        JOIN salas s ON r.sala_id = s.id
        ORDER BY fecha, hora_inicio;
      `);
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener reservas:', err.message);
      res.status(500).send('Error al obtener reservas');
    }
  });
  
  //Ruta para borrar una reserva manualmente
  app.delete('/reservas/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'DELETE FROM reservas WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) return res.status(404).send('Reserva no encontrada');
      res.send('Reserva cancelada/liberada correctamente');
    } catch (err) {
      console.error('Error al eliminar reserva:', err.message);
      res.status(500).send('Error al eliminar la reserva');
    }
  });
  
  const cron = require('node-cron');

  //Se ejecuta cada minuto y elimina las reservas vencidas automaticamente
  cron.schedule('* * * * *', async () => {
    const ahora = new Date();
    const fechaActual = ahora.toISOString().split('T')[0];
    const horaActual = ahora.toTimeString().split(':').slice(0, 2).join(':');

    try {
      const result = await pool.query(`
        DELETE FROM reservas
        WHERE fecha < $1
          OR (fecha = $1 AND hora_fin <= $2)
      `, [fechaActual, horaActual]);

      if (result.rowCount > 0) {
        console.log(`Reservas vencidas y eliminada: ${result.rowCount}`);
      }
    } catch (err) {
      console.error('Error al eliminar reservas vencidas:', err.message);
    }
  });


  app.listen(PORT, () => {
    console.log(`Room Service corriendo en http://localhost:${PORT}`);
  });
  