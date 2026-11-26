import { useState } from 'react';
import Spinner from './Spinner.jsx';

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(null); // 'toggle' | 'save' | 'delete' | null
  const [draft, setDraft] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
  });

  const startEdit = () => {
    setDraft({ title: task.title, description: task.description, priority: task.priority });
    setEditing(true);
  };

  const toggle = async () => {
    setBusy('toggle');
    await onUpdate(task._id, { completed: !task.completed });
    setBusy(null);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    setBusy('save');
    const ok = await onUpdate(task._id, draft);
    setBusy(null);
    if (ok) setEditing(false);
  };

  const remove = async () => {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    setBusy('delete');
    const ok = await onDelete(task._id);
    if (!ok) setBusy(null); // on success the item unmounts
  };

  if (editing) {
    return (
      <li className="card item" aria-busy={busy === 'save'}>
        <form className="form" onSubmit={save}>
          <input
            aria-label="Edit title"
            value={draft.title}
            maxLength={200}
            disabled={busy === 'save'}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            autoFocus
            required
          />
          <textarea
            aria-label="Edit description"
            value={draft.description}
            rows={2}
            maxLength={1000}
            disabled={busy === 'save'}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
          <div className="row">
            <select
              aria-label="Edit priority"
              value={draft.priority}
              disabled={busy === 'save'}
              onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
            <span className="actions">
              <button type="button" className="btn" disabled={busy === 'save'} onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button className="btn primary" disabled={busy === 'save' || !draft.title.trim()}>
                {busy === 'save' && <Spinner />}
                {busy === 'save' ? 'Saving…' : 'Save changes'}
              </button>
            </span>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`card item ${task.completed ? 'done' : ''} ${busy ? 'busy' : ''}`}
      data-priority={task.priority}
      aria-busy={!!busy}
    >
      <label className="check">
        {busy === 'toggle' ? (
          <Spinner size={18} label="Updating task" />
        ) : (
          <input
            type="checkbox"
            checked={task.completed}
            disabled={!!busy}
            onChange={toggle}
            aria-label={task.completed ? 'Mark as not completed' : 'Mark as completed'}
          />
        )}
      </label>
      <div className="body">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <span className="tag">{task.priority} priority</span>
      </div>
      <span className="actions">
        <button className="btn" disabled={!!busy} onClick={startEdit}>Edit</button>
        <button className="btn danger" disabled={!!busy} onClick={remove}>
          {busy === 'delete' && <Spinner />}
          {busy === 'delete' ? 'Deleting…' : 'Delete'}
        </button>
      </span>
    </li>
  );
}