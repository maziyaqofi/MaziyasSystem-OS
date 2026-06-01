import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

function MemoryVault() {
    const STORAGE_KEY = "maziyas_memory_vault";

    const [memories, setMemories] = useState([]);

    const [memoryForm, setMemoryForm] = useState({
        category: "Personal Identity",
        title: "",
        content: "",
    });

    useEffect(() => {
    const savedMemories =
        JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    setMemories(savedMemories);
    }, []);

    const saveMemories = (updatedMemories) => {
    setMemories(updatedMemories);

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedMemories)
    );
    };

    const handleAddMemory = (e) => {
    e.preventDefault();

    if (
        !memoryForm.title.trim() ||
        !memoryForm.content.trim()
    ) {
        alert("Isi title dan content terlebih dahulu.");
        return;
    }

    const newMemory = {
        id: Date.now(),
        category: memoryForm.category,
        title: memoryForm.title,
        content: memoryForm.content,
        createdAt: new Date().toISOString(),
    };

    saveMemories([newMemory, ...memories]);

    setMemoryForm({
        category: "Personal Identity",
        title: "",
        content: "",
    });
    };

    const handleDeleteMemory = (id) => {
    const updatedMemories = memories.filter(
        (memory) => memory.id !== id
    );

    saveMemories(updatedMemories);
    };

    const totalMemories = memories.length;

    const totalCategories = new Set(
    memories.map((memory) => memory.category)
    ).size;

    const latestMemory =
    memories.length > 0
        ? memories[0].title
        : "-";

return (
  <div className="space-y-8">
    <div>
      <h1
        className="text-5xl text-black"
        style={{ fontFamily: "DM Serif Display" }}
      >
        Memory Vault
      </h1>
      <p className="mt-2 text-[#7A4A62]">
        A place to keep what matters.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <StatCard label="Total Memories" value={totalMemories} />
      <StatCard label="Categories" value={totalCategories} />
      <StatCard label="Latest Added" value={latestMemory} />
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <form
        onSubmit={handleAddMemory}
        className="rounded-3xl border border-[#FFB3CF] bg-white p-6"
      >
        <h2 className="mb-5 text-lg font-bold text-[#3A1A2E]">
          Add Memory
        </h2>

        <div className="space-y-4">
          <select
            value={memoryForm.category}
            onChange={(e) =>
              setMemoryForm({ ...memoryForm, category: e.target.value })
            }
            className="w-full rounded-2xl border border-[#FFB3CF] bg-[#FFF0F5] px-4 py-3 text-sm outline-none"
          >
            <option>Personal Identity</option>
            <option>Important People</option>
            <option>Important Dates</option>
            <option>Life Timeline</option>
            <option>Personal Principles</option>
            <option>Other</option>
          </select>

          <input
            type="text"
            value={memoryForm.title}
            onChange={(e) =>
              setMemoryForm({ ...memoryForm, title: e.target.value })
            }
            placeholder="Memory title..."
            className="w-full rounded-2xl border border-[#FFB3CF] bg-[#FFF0F5] px-4 py-3 text-sm outline-none"
          />

          <textarea
            value={memoryForm.content}
            onChange={(e) =>
              setMemoryForm({ ...memoryForm, content: e.target.value })
            }
            placeholder="Write the memory..."
            className="h-36 w-full resize-none rounded-2xl border border-[#FFB3CF] bg-[#FFF0F5] px-4 py-3 text-sm outline-none"
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#C43870] px-5 py-3 text-sm font-bold text-white hover:bg-[#E05589]"
          >
            Save Memory
          </button>
        </div>
      </form>

      <div className="lg:col-span-2 rounded-3xl border border-[#FFB3CF] bg-white">
        <div className="border-b border-[#FFD6E7] px-6 py-5">
          <h2 className="text-lg font-bold text-[#3A1A2E]">
            Memory List
          </h2>
        </div>

        {memories.length === 0 ? (
          <div className="p-8 text-center text-[#7A4A62]">
            Belum ada memory.
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {memories.map((memory) => (
              <div
                key={memory.id}
                className="rounded-3xl border border-[#FFD6E7] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C43870]">
                      {memory.category}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-[#3A1A2E]">
                      {memory.title}
                    </h3>
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#7A4A62]">
                      {memory.content}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteMemory(memory.id)}
                    className="rounded-xl border border-[#EAEAEA] p-3 text-[#3A1A2E] hover:bg-[#FFF0F5] hover:text-[#C43870]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-[#FFB3CF] bg-white p-6 text-center">
      <p className="text-2xl font-bold text-[#C43870]">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#B07A95]">
        {label}
      </p>
    </div>
  );
}
}
export default MemoryVault;