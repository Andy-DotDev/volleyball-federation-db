const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Библиотека для Postgres

const app = express();
const port = 5000; // Порт бэкенда

app.use(cors()); 
app.use(express.json()); 

// 1. Подключение к базе данных
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '2005', // Твой пароль
  port: 5432,
});

// === АВТОРИЗАЦИЯ ===
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверяем учетные данные
    const validCredentials = {
      'admin_role': 'admin123',
      'editor_role': 'editor123',
      'viewer_role': 'viewer123'
    };

    const roleNames = {
      'admin_role': 'Администратор',
      'editor_role': 'Редактор',
      'viewer_role': 'Наблюдатель'
    };

    if (validCredentials[username] && validCredentials[username] === password) {
      res.json({
        success: true,
        username: username,
        role: username,
        roleName: roleNames[username]
      });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
// === Игроки ===
// 1. ПОЛУЧИТЬ ВСЕХ ИГРОКОВ (SELECT)
app.get('/api/players', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT players.*, clubs.name as club_name FROM players LEFT JOIN clubs ON players.club_id = clubs.club_id ORDER BY player_id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// 2. ДОБАВИТЬ ИГРОКА (INSERT)
app.post('/api/players', async (req, res) => {
  try {
    const { last_name, first_name, birth_date, gender, club_id, position } = req.body;
    
    const newPlayer = await pool.query(
      'INSERT INTO players (last_name, first_name, birth_date, gender, club_id, position) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [last_name, first_name, birth_date, gender, club_id, position]
    );

    res.json(newPlayer.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка при добавлении');
  }
});

// 3. ОБНОВИТЬ ИГРОКА (UPDATE)
app.put('/api/players/:id', async (req, res) => {
  try {
    const { id } = req.params; // ID берем из URL
    const { last_name, first_name, birth_date, gender, club_id, position } = req.body;

    const updatedPlayer = await pool.query(
      'UPDATE players SET last_name = $1, first_name = $2, birth_date = $3, gender = $4, club_id = $5, position = $6 WHERE player_id = $7 RETURNING *',
      [last_name, first_name, birth_date, gender, club_id, position, id]
    );

    res.json(updatedPlayer.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка при обновлении');
  }
});

// 4. УДАЛИТЬ ИГРОКА (DELETE)
app.delete('/api/players/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM players WHERE player_id = $1', [id]);
    res.json('Игрок удален');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка при удалении');
  }
});

// === КЛУБЫ (CLUBS) ===
app.get('/api/clubs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clubs ORDER BY club_id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка загрузки клубов');
  }
});

app.post('/api/clubs', async (req, res) => {
  try {
    const { name, city, foundation_year, head_coach_id } = req.body;
    const newClub = await pool.query(
      'INSERT INTO clubs (name, city, foundation_year, head_coach_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, city, foundation_year || null, head_coach_id || null]
    );
    res.json(newClub.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка добавления клуба');
  }
});

app.put('/api/clubs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, foundation_year, head_coach_id } = req.body;
    const updated = await pool.query(
      'UPDATE clubs SET name=$1, city=$2, foundation_year=$3, head_coach_id=$4 WHERE club_id=$5 RETURNING *',
      [name, city, foundation_year || null, head_coach_id || null, id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).send('Ошибка обновления клуба');
  }
});

app.delete('/api/clubs/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM clubs WHERE club_id=$1', [req.params.id]);
    res.json('Клуб удалён');
  } catch (err) {
    res.status(500).send('Ошибка удаления клуба');
  }
});

// === ТУРНИРЫ (TOURNAMENTS) ===
app.get('/api/tournaments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tournaments ORDER BY tournament_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Ошибка загрузки турниров');
  }
});

app.post('/api/tournaments', async (req, res) => {
  try {
    const { name, season, status } = req.body;
    const newT = await pool.query(
      'INSERT INTO tournaments (name, season, status) VALUES ($1, $2, $3) RETURNING *',
      [name, season, status || 'запланирован']
    );
    res.json(newT.rows[0]);
  } catch (err) {
    res.status(500).send('Ошибка добавления турнира');
  }
});

app.put('/api/tournaments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, season, status } = req.body;
    const updated = await pool.query(
      'UPDATE tournaments SET name=$1, season=$2, status=$3 WHERE tournament_id=$4 RETURNING *',
      [name, season, status, id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).send('Ошибка обновления турнира');
  }
});

app.delete('/api/tournaments/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tournaments WHERE tournament_id=$1', [req.params.id]);
    res.json('Турнир удалён');
  } catch (err) {
    res.status(500).send('Ошибка удаления турнира');
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Backend запущен на http://localhost:${port}`);
});