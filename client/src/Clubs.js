import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Clubs() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', city: '', foundation_year: '', head_coach_id: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/clubs`);
      setItems(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/clubs/${editId}`, form);
      } else {
        await axios.post(`${API_URL}/clubs`, form);
      }
      resetForm(); fetchItems();
    } catch (err) { alert('Ошибка при сохранении'); }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      city: item.city,
      foundation_year: item.foundation_year || '',
      head_coach_id: item.head_coach_id || ''
    });
    setIsEditing(true); setEditId(item.club_id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить клуб?')) {
      await axios.delete(`${API_URL}/clubs/${id}`);
      fetchItems();
    }
  };

  const resetForm = () => {
    setForm({ name: '', city: '', foundation_year: '', head_coach_id: '' });
    setIsEditing(false); setEditId(null);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div style={{ padding: '20px' }}>
      <h2>🏟️ Управление клубами</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
        <input name="name" placeholder="Название" value={form.name} onChange={handleChange} required />
        <input name="city" placeholder="Город" value={form.city} onChange={handleChange} required />
        <input name="foundation_year" type="number" placeholder="Год основания" value={form.foundation_year} onChange={handleChange} />
        <input name="head_coach_id" type="number" placeholder="ID тренера" value={form.head_coach_id} onChange={handleChange} />
        <div style={{ gridColumn: 'span 4' }}>
          <button type="submit" style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
            {isEditing ? ' Сохранить' : '➕ Добавить'}
          </button>
          {isEditing && <button type="button" onClick={resetForm} style={{ padding: '8px 16px', background: '#ccc', border: 'none', cursor: 'pointer' }}>Отмена</button>}
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#2c3e50', color: 'white' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Название</th>
            <th style={{ padding: '10px' }}>Город</th>
            <th style={{ padding: '10px' }}>Год осн.</th>
            <th style={{ padding: '10px' }}>ID тренера</th>
            <th style={{ padding: '10px' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.club_id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{item.club_id}</td>
              <td style={{ padding: '10px' }}>{item.name}</td>
              <td style={{ padding: '10px' }}>{item.city}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{item.foundation_year || '-'}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{item.head_coach_id || '-'}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button onClick={() => handleEdit(item)} style={{ background: '#2196F3', color: 'white', border: 'none', padding: '5px 8px', marginRight: '5px', cursor: 'pointer' }}>Р</button>
                <button onClick={() => handleDelete(item.club_id)} style={{ background: '#f44336', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer' }}>У</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clubs;