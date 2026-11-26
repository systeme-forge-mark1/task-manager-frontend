const BASE = `${import.meta.env.VITE_API_URL || ''}/api`;

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  getTasks: () => request('/tasks'),
  createTask: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id, changes) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(changes) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  getWeather: (city) => request(`/weather?city=${encodeURIComponent(city)}`),
};
