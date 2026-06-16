import { useState, useEffect } from "react";
import { Plus, Trash2, Check, Loader2, Inbox } from "lucide-react";

const API = "/api/tasks"; // Vite proxy forwards /api/* to http://localhost:3000

export default function App() {
  // ─── STATE ───────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ─── READ: load tasks when the component first mounts ──────────────────
  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API);
      if (!res.ok) throw new Error(`Failed to load tasks (${res.status})`);
      const result = await res.json();
      setTasks(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ─── CREATE: handle form submission ─────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), data: data.trim() }),
      });
      if (!res.ok) throw new Error(`Failed to create task (${res.status})`);
      const newTask = await res.json();

      // Update local state directly instead of refetching everything
      setTasks((prev) => [newTask, ...prev]);
      setName("");
      setData("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // ─── UPDATE: toggle a task's status ─────────────────────────────────────
  async function toggleStatus(task) {
    const newStatus = task.status === "done" ? "pending" : "done";
    try {
      const res = await fetch(`${API}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: task.name, data: task.data, status: newStatus }),
      });
      if (!res.ok) throw new Error(`Failed to update task (${res.status})`);
      const updated = await res.json();

      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  // ─── DELETE: remove a task ───────────────────────────────────────────────
  async function deleteTask(id) {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      // 204 = success with no body
      if (!res.ok && res.status !== 204) {
        throw new Error(`Failed to delete task (${res.status})`);
      }
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const pendingCount = tasks.filter((t) => t.status !== "done").length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-stone-500 text-sm mt-1">
            {loading
              ? "Loading..."
              : pendingCount === 0
              ? "All caught up."
              : `${pendingCount} task${pendingCount === 1 ? "" : "s"} remaining`}
          </p>
        </header>

        {/* Error banner */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-3">
              ✕
            </button>
          </div>
        )}

        {/* New task form */}
        <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-xl border border-stone-200 p-4 space-y-3">
          <input
            type="text"
            placeholder="What needs doing?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-base outline-none placeholder:text-stone-400 font-medium"
          />
          <input
            type="text"
            placeholder="Add a description (optional)"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full text-sm outline-none placeholder:text-stone-400 text-stone-600"
          />
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!name.trim() || submitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium disabled:bg-stone-300 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              Add task
            </button>
          </div>
        </form>

        {/* Task list */}
        {loading ? (
          <div className="flex justify-center py-16 text-stone-400">
            <Loader2 size={22} className="animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-stone-400">
            <Inbox size={28} className="mb-2" />
            <p className="text-sm">No tasks yet. Add one above.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-start gap-3 bg-white rounded-xl border border-stone-200 p-4"
              >
                {/* Toggle status */}
                <button
                  onClick={() => toggleStatus(task)}
                  aria-label={task.status === "done" ? "Mark as pending" : "Mark as done"}
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    task.status === "done"
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-stone-300 hover:border-stone-400"
                  }`}
                >
                  {task.status === "done" && <Check size={12} strokeWidth={3} />}
                </button>

                {/* Task text */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      task.status === "done" ? "line-through text-stone-400" : "text-stone-900"
                    }`}
                  >
                    {task.name}
                  </p>
                  {task.data && (
                    <p className="text-xs text-stone-500 mt-0.5">{task.data}</p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete task"
                  className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 transition-opacity flex-shrink-0 mt-0.5"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}