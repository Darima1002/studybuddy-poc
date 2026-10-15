
import { useEffect, useState } from "react";

type Task = {
  id: number;
  text: string;
  done: boolean;
};

export default function StudyChecklist() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("studybuddy-tasks");
      if (saved) setTasks(JSON.parse(saved));
    } catch {
      setTasks([]);
    }
  }, []);

  function save(updated: Task[]) {
    setTasks(updated);
    localStorage.setItem("studybuddy-tasks", JSON.stringify(updated));
  }

  function addTask() {
    if (!input.trim()) return;
    save([...tasks, {
      id: Date.now(),
      text: input.trim(),
      done: false
    }]);
    setInput("");
  }

  return (
    <section className="mt-6 rounded-xl border p-4">
      <h2 className="text-xl font-bold">My Study Tasks</h2>
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded border p-2 text-black"
          placeholder="Enter a study task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={addTask}
          className="rounded bg-blue-600 px-4 text-white"
        >
          Add
        </button>
      </div>

      {tasks.map((task) => (
        <div key={task.id} className="mt-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => save(tasks.map(t =>
              t.id === task.id ? { ...t, done: !t.done } : t
            ))}
          />
          <span className={task.done ? "flex-1 line-through" : "flex-1"}>
            {task.text}
          </span>
          <button
            onClick={() => save(tasks.filter(t => t.id !== task.id))}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </section>
  );
}
