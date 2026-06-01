import { useEffect, useState } from "react";
import { Trash2, CheckCircle, Circle, Clock } from "lucide-react";

function TaskManager() {
  const STORAGE_KEY = "maziyas_tasks";

  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: "",
    priority: "Medium",
    dueDate: "",
  });

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setTasks(savedTasks);
  }, []);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const handleAddTask = (e) => {
    e.preventDefault();

    if (!taskForm.title || !taskForm.dueDate) {
      alert("Isi judul task dan due date dulu ya.");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: taskForm.title,
      priority: taskForm.priority,
      dueDate: taskForm.dueDate,
      status: "Todo",
      createdAt: new Date().toISOString(),
    };

    saveTasks([newTask, ...tasks]);

    setTaskForm({
      title: "",
      priority: "Medium",
      dueDate: "",
    });
  };

  const handleChangeStatus = (id, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: newStatus } : task
    );

    saveTasks(updatedTasks);
  };

  const handleDeleteTask = (id) => {
    const confirmDelete = confirm("Hapus task ini?");
    if (!confirmDelete) return;

    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((task) => task.status === "Done").length;
  const doingTasks = tasks.filter((task) => task.status === "Doing").length;
  const todoTasks = tasks.filter((task) => task.status === "Todo").length;

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-5xl text-black"
          style={{ fontFamily: "DM Serif Display" }}
        >
          Task Manager
        </h1>
        <p className="mt-2 text-[#7A4A62]">
          Manage your priorities with clarity and calm.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <StatCard label="Total Tasks" value={totalTasks} />
        <StatCard label="Completed" value={doneTasks} />
        <StatCard label="In Progress" value={doingTasks} />
        <StatCard label="Pending" value={todoTasks} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleAddTask}
          className="rounded-3xl border border-[#FFB3CF] bg-white p-6"
        >
          <h2 className="mb-5 text-lg font-bold text-[#3A1A2E]">
            Add New Task
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#7A4A62]">
                Task Title
              </label>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e.target.value })
                }
                placeholder="Example: Kerjakan tugas kuliah"
                className="w-full rounded-2xl border border-[#FFB3CF] bg-[#FFF0F5] px-4 py-3 text-sm outline-none focus:border-[#C43870]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#7A4A62]">
                Priority
              </label>
              <select
                value={taskForm.priority}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, priority: e.target.value })
                }
                className="w-full rounded-2xl border border-[#FFB3CF] bg-[#FFF0F5] px-4 py-3 text-sm outline-none focus:border-[#C43870]"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#7A4A62]">
                Due Date
              </label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, dueDate: e.target.value })
                }
                className="w-full rounded-2xl border border-[#FFB3CF] bg-[#FFF0F5] px-4 py-3 text-sm outline-none focus:border-[#C43870]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#C43870] px-5 py-3 text-sm font-bold text-white hover:bg-[#E05589]"
            >
              Add Task
            </button>
          </div>
        </form>

        <div className="lg:col-span-2 rounded-3xl border border-[#FFB3CF] bg-white">
          <div className="border-b border-[#FFD6E7] px-6 py-5">
            <h2 className="text-lg font-bold text-[#3A1A2E]">Task List</h2>
          </div>

          {tasks.length === 0 ? (
            <div className="p-8 text-center text-[#7A4A62]">
              Belum ada task. Tambahkan task pertamamu.
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onChangeStatus={handleChangeStatus}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-[#FFB3CF] bg-white p-6 text-center">
      <p className="text-3xl font-bold text-[#C43870]">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#B07A95]">
        {label}
      </p>
    </div>
  );
}

function TaskCard({ task, onChangeStatus, onDelete }) {
  const priorityStyle = {
    High: "bg-[#FFE1E9] text-[#C43870]",
    Medium: "bg-[#FFF0F5] text-[#7A4A62]",
    Low: "bg-[#F9EEF3] text-[#7A4A62]",
  };

  const statusIcon = {
    Todo: <Circle size={18} />,
    Doing: <Clock size={18} />,
    Done: <CheckCircle size={18} />,
  };

  return (
    <div className="rounded-3xl border border-[#FFD6E7] bg-white p-5">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h3 className="text-lg font-bold text-[#3A1A2E]">{task.title}</h3>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-4 py-2 text-xs font-bold ${
                priorityStyle[task.priority]
              }`}
            >
              {task.priority}
            </span>

            <span className="text-sm text-[#7A4A62]">
              Due: {task.dueDate}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="rounded-xl border border-[#EAEAEA] p-3 text-[#3A1A2E] hover:bg-[#FFF0F5] hover:text-[#C43870]"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {["Todo", "Doing", "Done"].map((status) => (
          <button
            key={status}
            onClick={() => onChangeStatus(task.id, status)}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              task.status === status
                ? "bg-[#C43870] text-white"
                : "bg-[#FFF0F5] text-[#7A4A62] hover:bg-[#FFD6E7]"
            }`}
          >
            {statusIcon[status]}
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaskManager;