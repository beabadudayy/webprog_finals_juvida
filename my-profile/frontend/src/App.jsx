import { useEffect, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || '/api/guestbook';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ name: '', message: '' });
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <>
      {/* ── Hero Header ── */}
      <header className="hero">
        <span className="hero-label">Personal Guestbook</span>
        <h1>Raiza Juvida</h1>
        <p>Leave a note — I read every single one.</p>
      </header>

      {/* ── Sign Form ── */}
      <section className="glass-card form-card">
        <h2 className="section-title">
          <span>&#9998;</span> Sign the Guestbook
        </h2>
        <form onSubmit={save}>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <textarea
              className="form-textarea"
              placeholder="Write your message..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Sign Guestbook'}
          </button>
        </form>
      </section>

      <div className="divider" />

      {/* ── Entries Feed ── */}
      <section>
        <h2 className="section-title">
          <span>&#128172;</span> Messages
          {!loading && <span className="entry-count">{entries.length}</span>}
        </h2>

        {loading ? (
          <div className="empty-state">Loading messages...</div>
        ) : entries.length === 0 ? (
          <div className="glass-card">
            <div className="empty-state">
              <div className="empty-icon">&#128140;</div>
              <p>No messages yet. Be the first to sign!</p>
            </div>
          </div>
        ) : (
          <div className="entries-list">
            {entries.map(entry => (
              <div key={entry.id} className="glass-card entry-card">
                <div className="entry-body">
                  <div className="entry-name">{entry.name}</div>
                  <p className="entry-message">{entry.message}</p>
                  <div className="entry-time">{formatDate(entry.created_at)}</div>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => remove(entry.id)}
                  title="Delete entry"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Raiza Juvida &mdash; Built with React &amp; NestJS
      </footer>
    </>
  );
}
