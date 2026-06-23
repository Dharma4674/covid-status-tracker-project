import React, { useState, useEffect } from 'react';

function App() {
  const [globalData, setGlobalData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [searchCountry, setSearchCountry] = useState('India');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Global status fetch
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((res) => res.json())
      .then((data) => setGlobalData(data))
      .catch((err) => console.error("Global data fetch error:", err));
  }, []);

  // Country status fetch
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://disease.sh/v3/covid-19/countries/${searchCountry}`)
      .then((res) => {
        if (!res.ok) throw new Error("Country not found!");
        return res.json();
      })
      .then((data) => {
        setCountryData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [searchCountry]);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>🌐 Health & COVID-19 Status Tracker</h1>
      
      {/* Global Dashboard */}
      {globalData && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0, color: '#2980b9' }}>Global Summary</h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '150px', background: '#e8f4fd', padding: '15px', borderRadius: '6px' }}>
              <strong>Total Cases:</strong> <p style={{ fontSize: '20px', margin: '5px 0 0', color: '#2980b9' }}>{globalData.cases.toLocaleString()}</p>
            </div>
            <div style={{ flex: 1, minWidth: '150px', background: '#eafaf1', padding: '15px', borderRadius: '6px' }}>
              <strong>Recovered:</strong> <p style={{ fontSize: '20px', margin: '5px 0 0', color: '#27ae60' }}>{globalData.recovered.toLocaleString()}</p>
            </div>
            <div style={{ flex: 1, minWidth: '150px', background: '#fdf2f2', padding: '15px', borderRadius: '6px' }}>
              <strong>Deaths:</strong> <p style={{ fontSize: '20px', margin: '5px 0 0', color: '#c0392b' }}>{globalData.deaths.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Country Specific Search */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Search Country Status</h2>
        <div style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Enter country name (e.g., India, USA)" 
            style={{ padding: '10px', width: '250px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim() !== '') {
                setSearchCountry(e.target.value);
              }
            }}
          />
          <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>Press <b>Enter</b> to search</small>
        </div>

        {loading && <p>Loading statistics...</p>}
        {error && <p style={{ color: 'red' }}>⚠️ Error: {error}</p>}

        {!loading && !error && countryData && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={countryData.countryInfo.flag} alt="flag" style={{ width: '40px', borderRadius: '4px' }} />
              <h3 style={{ margin: 0 }}>{countryData.country} Statistics</h3>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
              <div style={{ flex: 1, minWidth: '150px', background: '#fcf3cf', padding: '15px', borderRadius: '6px' }}>
                <strong>Today's Cases:</strong> <p style={{ fontSize: '18px', margin: '5px 0 0', color: '#f39c12' }}>+{countryData.todayCases.toLocaleString()}</p>
              </div>
              <div style={{ flex: 1, minWidth: '150px', background: '#ebdef0', padding: '15px', borderRadius: '6px' }}>
                <strong>Active Cases:</strong> <p style={{ fontSize: '18px', margin: '5px 0 0', color: '#8e44ad' }}>{countryData.active.toLocaleString()}</p>
              </div>
              <div style={{ flex: 1, minWidth: '150px', background: '#f5eef8', padding: '15px', borderRadius: '6px' }}>
                <strong>Critical:</strong> <p style={{ fontSize: '18px', margin: '5px 0 0', color: '#9b59b6' }}>{countryData.critical.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;