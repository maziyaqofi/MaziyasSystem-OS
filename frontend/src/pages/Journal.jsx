import { useState } from "react";
import { Trash2 } from "lucide-react";

function Journal() {
  const STORAGE_KEY = "maziyas_journal";

  const [journals, setJournals] = useState(() => {
    try {
      const savedJournals = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      return Array.isArray(savedJournals) ? savedJournals : [];
    } catch {
      return [];
    }
  });
  const [content, setContent] = useState("");

  const saveJournals = (updatedJournals) => {
    setJournals(updatedJournals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJournals));
  };

  const handleAddJournal = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Isi journal terlebih dahulu.");
      return;
    }

    const newJournal = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      content,
      createdAt: new Date().toISOString(),
    };

    saveJournals([newJournal, ...journals]);
    setContent("");
  };

  const handleDeleteJournal = (id) => {
    const updatedJournals = journals.filter((journal) => journal.id !== id);
    saveJournals(updatedJournals);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-5xl text-black"
          style={{ fontFamily: "DM Serif Display" }}
        >
          Daily Journal
        </h1>
        <p className="mt-2 text-[#7A4A62]">
          Write anything you need to release.
        </p>
      </div>

      <form
        onSubmit={handleAddJournal}
        className="rounded-3xl border border-[#FFB3CF] bg-white p-6"
      >
        <h2 className="mb-5 text-lg font-bold text-[#3A1A2E]">
          Dear Journal,
        </h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis apapun yang sedang kamu rasakan atau pikirkan hari ini..."
          className="h-64 w-full resize-none rounded-2xl border border-[#FFB3CF] bg-[#FFF0F5] px-4 py-3 text-sm leading-6 text-[#3A1A2E] outline-none focus:border-[#C43870]"
        />

        <button
          type="submit"
          className="mt-4 w-full rounded-2xl bg-[#C43870] px-5 py-3 text-sm font-bold text-white hover:bg-[#E05589]"
        >
          Save Journal
        </button>
      </form>

      <div className="rounded-3xl border border-[#FFB3CF] bg-white">
        <div className="border-b border-[#FFD6E7] px-6 py-5">
          <h2 className="text-lg font-bold text-[#3A1A2E]">
            Journal History
          </h2>
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
                      {formatDate(journal.date)}
                    </p>

                    <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#7A4A62]">
                      {journal.content}
                    </p>
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
}

export default Journal;
