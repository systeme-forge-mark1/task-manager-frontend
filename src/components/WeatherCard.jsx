import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function WeatherCard() {
  const [city, setCity] = useState(() => localStorage.getItem('city') || 'Lahore');
  const [input, setInput] = useState(city);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setError('');
    api
      .getWeather(city)
      .then((d) => !cancelled && (setData(d), localStorage.setItem('city', city)))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [city]);

  const search = (e) => {
    e.preventDefault();
    if (input.trim()) setCity(input.trim());
  };

  return (
    <aside className="weather" aria-label="Weather">
      {data && !error ? (
        <div className="w-main">
          <strong>{Math.round(data.temperature)}{data.units.temperature}</strong>
          <span>{data.condition}</span>
          <small>
            {data.city}, {data.country} · H {Math.round(data.high)}° L {Math.round(data.low)}° · Wind {data.windSpeed} {data.units.wind}
          </small>
        </div>
      ) : (
        <small className={error ? 'err' : 'muted'}>{error || 'Loading weather…'}</small>
      )}
      <form onSubmit={search}>
        <input aria-label="City" value={input} onChange={(e) => setInput(e.target.value)} placeholder="City" />
        <button className="btn">Update</button>
      </form>
    </aside>
  );
}
