import React, { useState } from 'react';
import Players from './Players';
import Clubs from './Clubs';
// import Tournaments from './Tournaments'; // Раскомментируешь, когда создашь

function App() {
  const [activeTab, setActiveTab] = useState('players');

  const tabs = [
    { id: 'players', label: ' Игроки', component: <Players /> },
    { id: 'clubs', label: ' Клубы', component: <Clubs /> },
    // { id: 'tournaments', label: '🏆 Турниры', component: <Tournaments /> }
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f5f7fa' }}>
      <header style={{ background: '#1e3a8a', color: 'white', padding: '15px 20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>Всероссийская Федерация Волейбола</h1>
        <nav style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                background: activeTab === tab.id ? '#3b82f6' : 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>
      <main style={{ padding: '20px' }}>
        {tabs.find(t => t.id === activeTab)?.component}
      </main>
    </div>
  );
}

export default App;