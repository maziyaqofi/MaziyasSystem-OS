import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

function Journal() {
  const STORAGE_KEY = "maziyas_journal";

  const [journals, setJournals] = useState([]);

  const [journalForm, setJournalForm] = useState({
    reflection: "",
    learning: "",
    gratitude: "",
  });

  useEffect(() => {
  const savedJournal =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  setJournals(savedJournal);
  }, []);

  const saveJournals = (updatedJournals) => {
  setJournals(updatedJournals);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedJournals)
  );
  };

  const handleAddJournal = (e) => {
  e.preventDefault();

  if (
    !journalForm.reflection.trim() ||
    !journalForm.learning.trim() ||
    !journalForm.gratitude.trim()
  ) {
    alert("Lengkapi semua bagian journal.");
    return;
  }

  const newJournal = {
    id: Date.now(),

    date: new Date().toISOString().split("T")[0],

    reflection: journalForm.reflection,

    learning: journalForm.learning,

    gratitude: journalForm.gratitude,

    createdAt: new Date().toISOString(),
  };

  saveJournals([newJournal, ...journals]);

  setJournalForm({
    reflection: "",
    learning: "",
    gratitude: "",
  });
  };

  const handleDeleteJournal = (id) => {
  const updatedJournals = journals.filter(
    (journal) => journal.id !== id
  );

  saveJournals(updatedJournals);
  };

  const totalJournals = journals.length;
  const latestJournal =
    journals.length > 0
      ? journals[0].date
      : "-";

return (
  <div className="space-y-8">
    <div>
      <h1
        className="text-5xl text-black"
        style={{ fontFamily: "DM Serif Display" }}
      >
        Daily Journal
      </h1>
      <p className="mt-2 text-[#7A4A62]">Reflect. Learn. Grow.</p>
    </div>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <StatCard label="Total Journals" value={totalJournals} />
      <StatCard label="Latest Journal" value={latestJournal} />
    </div>

    <form
      onSubmit={handleAddJournal}
      className="rounded-3xl border border-[#FFB3CF] bg-white p-6"
    >
      <h2 className="mb-5 text-lg font-bold text-[#3A1A2E]">
        Write Today&apos;s Journal
      </h2>

      <div className="space-y-4">
        <textarea
          value={journalForm.reflection}
          onChange={(e) =>
            setJournalForm({ ...journalForm, reflection: e.target.value })
          }
          placeholder="How was my day?"
          className="h-28 w-full resize-none rounded-2xl border border-[#FFB3CF] bg-[#FFF0F5] px-4 py-3 text-sm outline-none"
        />

        <textarea
          value={journalForm.learning}
          onChange={(e) =>
            setJournalForm({ ...journalForm, learning: e.target.value })
          }
          placeholder="What did I learn today?"
          className="h-28 w-full resize-none rounded-2xl border border-[#FFB3CF] bg-[#FFF0F5] px-4 py-3 text-sm outline-none"
        />

        <textarea
          value={journalForm.gratitude}
          onChange={(e) =>
            setJournalForm({ ...journalForm, gratitude: e.target.value })
          }
          placeholder="What am I grateful for today?"
          className="h-28 w-full resize-none rounded-2xl border border-[#FFB3CF] bg-[#FFF0F5] px-4 py-3 text-sm outline-none"
        />

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#C43870] px-5 py-3 text-sm font-bold text-white hover:bg-[#E05589]"
        >
          Save Journal
        </button>
      </div>
    </form>

    <div className="rounded-3xl border border-[#FFB3CF] bg-white">
      <div className="border-b border-[#FFD6E7] px-6 py-5">
        <h2 className="text-lg font-bold text-[#3A1A2E]">Journal History</h2>
      </div>

      {journals.length === 0 ? (
        <div className="p-8 text-center text-[#7A4A62]">
          Belum ada journal.
        </div>
      ) : (
        <div className="space-y-4 p-6">
          {journals.map((journal) => (
            <div
              key={journal.id}
              className="rounded-3xl border border-[#FFD6E7] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C43870]">
                    {journal.date}
                  </p>

                  <div className="mt-4 space-y-4 text-sm text-[#7A4A62]">
                    <div>
                      <p className="font-bold text-[#3A1A2E]">Reflection</p>
                      <p className="mt-1 whitespace-pre-line">
                        {journal.reflection}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-[#3A1A2E]">Learning</p>
                      <p className="mt-1 whitespace-pre-line">
                        {journal.learning}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-[#3A1A2E]">Gratitude</p>
                      <p className="mt-1 whitespace-pre-line">
                        {journal.gratitude}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteJournal(journal.id)}
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

export default Journal;