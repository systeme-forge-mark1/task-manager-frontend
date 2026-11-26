import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import TaskForm from './components/TaskForm.jsx';
import TaskItem from './components/TaskItem.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import Spinner from './components/Spinner.jsx';

const FILTERS = ['all', 'active', 'completed'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const run = useCallback(async (fn) => {
    setError('');
    try {
      return await fn();
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  useEffect(() => {
    run(async () => setTasks(await api.getTasks())).finally(() => setLoading(false));
  }, [run]);

  const addTask = (task) =>
    run(async () => {
      const created = await api.createTask(task);
      setTasks((t) => [created, ...t]);
      return true;
    });

  const updateTask = (id, changes) =>
    run(async () => {
      const updated = await api.updateTask(id, changes);
      setTasks((t) => t.map((x) => (x._id === id ? updated : x)));
      return true;
    });

  const deleteTask = (id) =>
    run(async () => {
      await api.deleteTask(id);
      setTasks((t) => t.filter((x) => x._id !== id));
      return true;
    });

  const visible = useMemo(
    () =>
      tasks.filter((t) =>
        filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed
      ),
    [tasks, filter]
  );
  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <main className="shell">
      <header className="masthead">
        <div>
          <h1>Today’s tasks</h1>
          <p className="muted">
            {loading
              ? 'Loading…'
              : tasks.length === 0
              ? 'Nothing planned yet.'
              : `${remaining} of ${tasks.length} still to do`}
          </p>
        </div>
        <WeatherCard />
      </header>

      <TaskForm onSubmit={addTask} />

      {error && (
        <div className="alert" role="alert">
          {error}
          <button className="link" onClick={() => setError('')}>Dismiss</button>
        </div>
      )}

      <div className="filters" role="tablist" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={filter === f ? 'tab active' : 'tab'}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="center">
          <Spinner size={26} label="Loading tasks" /> Loading tasks…
        </div>
      ) : visible.length === 0 ? (
        <p className="empty">
          {filter === 'all' ? 'Add your first task above.' : `No ${filter} tasks.`}
        </p>
      ) : (
        <ul className="list">
          {visible.map((task) => (
            <TaskItem key={task._id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
          ))}
        </ul>
      )}
    </main>
  );
}