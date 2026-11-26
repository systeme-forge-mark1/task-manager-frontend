import { useState } from 'react';

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    const ok = await onSubmit({ title, description, priority });
    setBusy(false);
    if (ok) {
      setTitle('');
      setDescription('');
      setPriority('medium');
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <input
        aria-label="Task title"
        placeholder="What needs doing?"
        value={title}
        maxLength={200}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        aria-label="Task description"
        placeholder="Notes (optional)"
        value={description}
        maxLength={1000}
        rows={2}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="row">
        <select aria-label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <button className="btn primary" disabled={busy || !title.trim()}>
          {busy ? 'Adding…' : 'Add task'}
        </button>
      </div>
    </form>
  );
}
