import { useState } from 'react';

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
  });

  const startEdit = () => {
    setDraft({ title: task.title, description: task.description, priority: task.priority });
    setEditing(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    const ok = await onUpdate(task._id, draft);
    if (ok) setEditing(false);
  };

  const remove = () => {
    if (window.confirm(`Delete “${task.title}”?`)) onDelete(task._id);
  };

  if (editing) {
    return (
      <li className="card item">
        <form className="form" onSubmit={save}>
          <input
            aria-label="Edit title"
            value={draft.title}
            maxLength={200}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            autoFocus
            required
          />
          <textarea
            aria-label="Edit description"
            value={draft.description}
            rows={2}
            maxLength={1000}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
          <div className="row">
            <select
              aria-label="Edit priority"
              value={draft.priority}
              onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
            <span className="actions">
              <button type="button" className="btn" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn primary">Save changes</button>
            </span>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`card item ${task.completed ? 'done' : ''}`} data-priority={task.priority}>
      <label className="check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onUpdate(task._id, { completed: !task.completed })}
          aria-label={task.completed ? 'Mark as not completed' : 'Mark as completed'}
        />
      </label>
      <div className="body">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <span className="tag">{task.priority} priority</span>
      </div>
      <span className="actions">
        <button className="btn" onClick={startEdit}>Edit</button>
        <button className="btn danger" onClick={remove}>Delete</button>
      </span>
    </li>
  );
}
