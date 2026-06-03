import { useState } from "react";
import { Trash2 } from "lucide-react";

function EmotionalTracker() {
  const STORAGE_KEY = "maziyas_emotional_logs";
  const [logs, setLogs] = useState(() => {
    try {
      const savedLogs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      return Array.isArray(savedLogs) ? savedLogs : [];
    } catch {
      return [];
    }
  });
  const [openDate, setOpenDate] = useState(null);

  const totalCheckIn = logs.length;

  const recordedDays = new Set(logs.map((log) => log.date)).size;

  const averageEnergy =
    logs.length > 0
      ? (
          logs.reduce((sum, log) => sum + Number(log.energy), 0) / logs.length
        ).toFixed(1)
      : "0.0";

  const moodCounts = logs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1;
    return acc;
  }, {});

  const mostMood =
    Object.keys(moodCounts).length > 0
      ? Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "-";

  const groupedLogs = logs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }

    acc[log.date].push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const handleDelete = (id) => {
    const confirmDelete = confirm("Hapus emotional log ini?");
    if (!confirmDelete) return;

    const updatedLogs = logs.filter((log) => log.id !== id);

    setLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (createdAt) => {
    return new Date(createdAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1
          className="text-5xl text-black"
          style={{ fontFamily: "DM Serif Display" }}
        >
          Maziya&apos;s Emotional Tracker
        </h1>
        <p className="mt-2 text-[#7A4A62]">
          Track your emotional pattern with care and honesty.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-xl border border-[#FFB3CF] bg-white p-6 text-center">
          <p className="text-3xl font-bold text-[#C43870]">{totalCheckIn}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#B07A95]">
            Total Check-In
          </p>
        </div>

        <div className="rounded-xl border border-[#FFB3CF] bg-white p-6 text-center">
          <p className="text-3xl font-bold text-[#C43870]">{recordedDays}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#B07A95]">
            Day Recorded
          </p>
        </div>

        <div className="rounded-xl border border-[#FFB3CF] bg-white p-6 text-center">
          <p className="text-3xl font-bold text-[#C43870]">{averageEnergy}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#B07A95]">
            Average Energy
          </p>
        </div>

        <div className="rounded-xl border border-[#FFB3CF] bg-white p-6 text-center">
          <p className="text-2xl font-bold text-[#C43870]">{mostMood}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B07A95]">
            Most Frequent Mood
          </p>
        </div>
      </div>

      {/* History */}
      <div className="rounded-xl border border-[#FFB3CF] bg-white">
        <div className="flex items-center justify-between border-b border-[#FFD6E7] px-6 py-3">
          <h2 className="text-lg font-bold uppercase tracking-[0.14em] text-[#C43870]">
            Complete History
          </h2>

          <p className="text-sm font-semibold text-[#C43870]">
            {logs.length} entri
          </p>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-[#7A4A62]">
            Belum ada emotional check-in.
          </div>
        ) : (
          <div className="px-6 py-1">
            {sortedDates.map((date) => {
            const isOpen = openDate === date;
            const dailyLogs = groupedLogs[date];

            return (
                <div
                key={date}
                >
                <button
                    onClick={() => setOpenDate(isOpen ? null : date)}
                    className="flex w-full items-center justify-between px-2 py-1 text-left hover:bg-[#FFF0F5]"
                >
                    <div>
                    <h3 className="font-bold text-[#3A1A2E]">
                        {formatDate(date)}
                    </h3>
                    </div>

                    <span className="text-2xl text-[#C43870]">
                    {isOpen ? "⌃" : ">"}
                    </span>
                </button>

                {isOpen && (
                    <div className="space-y-2 border-t border-[#FFD6E7] px-5 py-2">
                    {dailyLogs.map((log) => (
                        <div
                        key={log.id}
                        className="rounded-xl border border-[#FFD6E7] bg-white px-5 py-2"
                        >
                        <div className="flex items-stretch justify-between gap-5">
                            <div className="flex min-h-full w-32 flex-col border-r border-[#FFB3CF] pt-3 pr-5">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E05589]">
                                {log.phase}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#B07A95]">
                                {formatTime(log.created_at)}
                            </p>
                            </div>

                            <div className="flex-1">
                            <div className="mb-2 flex items-center justify-between gap-4">
                                <p className="text-lg font-bold text-[#3A1A2E] pt-1">
                                {log.mood}
                                </p>

                                <div className="flex-1 max-w-md">
                                    <div className="h-2 rounded-full bg-[#FFD6E7]">
                                        <div
                                        className="h-2 rounded-full bg-[#6AA56A]"
                                        style={{
                                            width: `${Number(log.energy) * 10}%`,
                                        }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                <p className="text-sm font-semibold text-[#7A4A62]">
                                    ⚡ {log.energy}/10
                                </p>

                                <button
                                    onClick={() => handleDelete(log.id)}
                                    className="rounded-xl border border-[#EAEAEA] p-3 text-[#3A1A2E] hover:bg-[#FFF0F5] hover:text-[#C43870]"
                                >
                                    <Trash2 size={14} />
                                </button>
                                </div>
                            </div>

                            <p className="mt-2 rounded-xl bg-[#FFF0F5] px-4 py-2 text-xs italic text-[#7A4A62]">
                                &quot;{log.reason || "Tidak ada reason"}&quot;
                            </p>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmotionalTracker;
