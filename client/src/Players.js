import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Players() {
  // Состояние (переменные)
  const [players, setPlayers] = useState([]); // Список игроков
  const [form, setForm] = useState({ last_name: '', first_name: '', birth_date: '', gender: 'М', club_id: 1, position: '' }); // Данные формы
  const [isEditing, setIsEditing] = useState(false); // Режим редактирования
  const [editId, setEditId] = useState(null); // ID редактируемого игрока

  // 1. При загрузке страницы получаем данные с Backend
  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/players');
      setPlayers(response.data);
    } catch (error) {
      console.error("Ошибка загрузки", error);
    }
  };

  // 2. Отправка формы (Добавление или Обновление)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Если редактируем - шлем PUT запрос
        await axios.put(`http://localhost:5000/api/players/${editId}`, form);
      } else {
        // Если добавляем - шлем POST запрос
        await axios.post('http://localhost:5000/api/players', form);
      }
      
      // Очищаем форму и обновляем список
      resetForm();
      fetchPlayers();
    } catch (error) {
      console.error("Ошибка отправки", error);
    }
  };

  // 3. Подготовка к редактированию
  const handleEdit = (player) => {
    setForm({
      last_name: player.last_name,
      first_name: player.first_name,
      birth_date: player.birth_date,
      gender: player.gender,
      club_id: player.club_id,
      position: player.position
    });
    setIsEditing(true);
    setEditId(player.player_id);
  };

  // 4. Удаление
  const handleDelete = async (id) => {
    if (window.confirm("Точно удалить игрока?")) {
      await axios.delete(`http://localhost:5000/api/players/${id}`);
      fetchPlayers();
    }
  };

  // Вспомогательные функции
  const resetForm = () => {
    setForm({ last_name: '', first_name: '', birth_date: '', gender: 'М', club_id: 1, position: '' });
    setIsEditing(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Управление игроками</h2>

      {/* Форма ввода */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f4f4f4', borderRadius: '8px' }}>
        <h3>{isEditing ? ' Редактирование' : ' Добавить игрока'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          
          <input name="last_name" placeholder="Фамилия" value={form.last_name} onChange={handleChange} required />
          <input name="first_name" placeholder="Имя" value={form.first_name} onChange={handleChange} required />
          <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} required />
          
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="М">Мужской</option>
            <option value="Ж">Женский</option>
          </select>
          
          <input name="club_id" type="number" placeholder="ID Клуба" value={form.club_id} onChange={handleChange} />
          <input name="position" placeholder="Амплуа" value={form.position} onChange={handleChange} />

          <div style={{ gridColumn: 'span 3', display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: '10px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
              {isEditing ? 'Сохранить' : 'Добавить'}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} style={{ padding: '10px', background: '#ccc', border: 'none', cursor: 'pointer' }}>
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Таблица */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#333', color: 'white' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>ФИО</th>
            <th style={{ padding: '10px' }}>Дата рождения</th>
            <th style={{ padding: '10px' }}>Пол</th>
            <th style={{ padding: '10px' }}>Клуб</th>
            <th style={{ padding: '10px' }}>Амплуа</th>
            <th style={{ padding: '10px' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.player_id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{player.player_id}</td>
              <td style={{ padding: '10px' }}>{player.last_name} {player.first_name}</td>
              <td style={{ padding: '10px' }}>{new Date(player.birth_date).toLocaleDateString()}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{player.gender}</td>
              <td style={{ padding: '10px' }}>{player.club_name || 'Не указан'}</td>
              <td style={{ padding: '10px' }}>{player.position}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button onClick={() => handleEdit(player)} style={{ background: '#2196F3', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}>
                  Р
                </button>
                <button onClick={() => handleDelete(player.player_id)} style={{ background: '#f44336', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                  У
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Players;