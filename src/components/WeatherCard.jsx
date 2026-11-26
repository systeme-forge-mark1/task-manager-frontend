import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Spinner from './Spinner.jsx';

export default function WeatherCard() {
  const [city, setCity] = useState(() => localStorage.getItem('city') || 'Lahore');
  const [input, setInput] = useState(city);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    api
      .getWeather(city)
      .then((d) => {
        if (cancelled) return;
        setData(d);
        localStorage.setItem('city', city);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [city]);

  const search = (e) => {
    e.preventDefault();
    const next = input.trim();
    if (!next || loading) return;
    if (next === city) {
      // same city: force a refresh by re-running the effect
      setCity('');
      setTimeout(() => setCity(next), 0);
    } else {
      setCity(next);
    }
  };

  return (
    <aside className="weather" aria-label="Weather" aria-busy={loading}>
      {data && !error ? (
        <div className="w-main" style={{ opacity: loading ? 0.5 : 1 }}>
          <strong>{Math.round(data.temperature)}{data.units.temperature}</strong>
          <span>{data.condition}</span>
          <small>
            {data.city}, {data.country} · H {Math.round(data.high)}° L {Math.round(data.low)}° · Wind {data.windSpeed} {data.units.wind}
          </small>
        </div>
      ) : (
        <small className={error ? 'err' : 'muted'} style={{ display: 'block', marginBottom: '0.5rem' }}>
          {loading ? (<><Spinner size={14} label="Loading weather" /> Loading weather…</>) : error}
        </small>
      )}
      <form onSubmit={search}>
        <input aria-label="City" value={input} onChange={(e) => setInput(e.target.value)} placeholder="City" />
        <button className="btn" disabled={loading || !input.trim()}>
          {loading && <Spinner size={12} />}
          {loading ? 'Updating' : 'Update'}
        </button>
      </form>
    </aside>
  );
}