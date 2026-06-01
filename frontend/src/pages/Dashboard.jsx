import { useEffect, useState } from "react";

const STORAGE_KEY = "maziyas_emotional_logs";
const MONTHLY_STREAK_TARGET = 30;

const formatDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [emotionalLogs, setEmotionalLogs] = useState(() => {
    const savedLogs = localStorage.getItem(STORAGE_KEY);

    if (!savedLogs) {
      return [];
    }

    try {
      const parsedLogs = JSON.parse(savedLogs);
      return Array.isArray(parsedLogs) ? parsedLogs : [];
    } catch {
      return [];
    }
  });
  const [checkIn, setCheckIn] = useState({
    mood: "",
    energy: "5",
    reason: "",
  });

  const phases = ["Morning", "Afternoon", "Evening", "Night"];

  const moodOptions = [
    { emoji: "😄", english: "Happy", indonesia: "Bahagia" },
    { emoji: "🌸", english: "Calm", indonesia: "Tenang" },
    { emoji: "⚡", english: "Motivated", indonesia: "Semangat" },
    { emoji: "😰", english: "Anxious", indonesia: "Cemas" },
    { emoji: "❤️", english: "In Love", indonesia: "Jatuh Cinta" },
    { emoji: "🌪️", english: "Chaotic", indonesia: "Kacau" },
    { emoji: "😠", english: "Angry", indonesia: "Marah" },
    { emoji: "😢", english: "Sad", indonesia: "Sedih" },
    { emoji: "😴", english: "Exhausted", indonesia: "Lelah" },
    { emoji: "😐", english: "Neutral", indonesia: "Netral" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const todayKey = formatDateKey(currentTime);
  const currentMonthKey = todayKey.slice(0, 7);

  const todaysLogs = emotionalLogs.filter((log) => log.date === todayKey);

  const latestCheckIn = todaysLogs.at(-1) ?? null;
  const averageEnergy =
    todaysLogs.length > 0
      ? (
          todaysLogs.reduce((total, log) => total + Number(log.energy), 0) /
          todaysLogs.length
        ).toFixed(1)
      : "0.0";

  const monthlyActiveDays = new Set(
    emotionalLogs
      .filter((log) => log.date.startsWith(currentMonthKey))
      .map((log) => log.date),
  ).size;
  const streakCount = Math.min(monthlyActiveDays, MONTHLY_STREAK_TARGET);
  const streakPercent = Math.round(
    (streakCount / MONTHLY_STREAK_TARGET) * 100,
  );
  const isMonthlyComplete = streakCount >= MONTHLY_STREAK_TARGET;
  const streakColor = isMonthlyComplete ? "#2EDB72" : "#C43870";

  const energyLevel = Number(checkIn.energy);
  const energyProgress = `${((energyLevel - 1) / 9) * 100}%`;

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getPhaseLog = (phase) =>
    todaysLogs.find((log) => log.phase === phase) ?? null;

  const getMoodEmoji = (mood) => mood?.split(" ")[0] ?? "";

  const resetCheckIn = () => {
    setCheckIn({
      mood: "",
      energy: "5",
      reason: "",
    });
  };

  const openCheckIn = (phase) => {
    const savedPhaseLog = getPhaseLog(phase);

    setSelectedPhase(phase);
    setCheckIn(
      savedPhaseLog
        ? {
            mood: savedPhaseLog.mood,
            energy: savedPhaseLog.energy,
            reason: savedPhaseLog.reason,
          }
        : {
            mood: "",
            energy: "5",
            reason: "",
          },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhase(null);
    resetCheckIn();
  };

  const handleEnergyChange = (event) => {
    setCheckIn({ ...checkIn, energy: event.target.value });
  };

  const handleSaveCheckIn = () => {
    if (
      !selectedPhase ||
      !checkIn.mood ||
      !checkIn.energy ||
      !checkIn.reason
    ) {
      alert("Isi mood, energy, dan reason dulu ya.");
      return;
    }

    const newCheckIn = {
      id: `${todayKey}-${selectedPhase}`,
      date: todayKey,
      phase: selectedPhase,
      mood: checkIn.mood,
      energy: checkIn.energy,
      reason: checkIn.reason,
      created_at: new Date().toISOString(),
    };

    const updatedLogs = [
      ...emotionalLogs.filter(
        (log) => !(log.date === todayKey && log.phase === selectedPhase),
      ),
      newCheckIn,
    ];

    setEmotionalLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    closeModal();
    alert("Emotional check-in berhasil disimpan.");
  };

  return (
    <div className="space-y-7 bg-[#FFF0F5]">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1
            className="text-4xl leading-tight"
            style={{ fontFamily: "DM Serif Display" }}
          >
            <span className="text-black">Good Morning,</span>{" "}
            <span className="text-[#C43870]">Maziya</span>
            <span className="text-black"> 🌸</span>
          </h1>
        </div>

        <div className="text-right">
          <p
            className="text-2xl font-bold text-[#7A4A62]"
            style={{ fontFamily: "DM Sans" }}
          >
            {formattedTime}
          </p>

          <p
            className="mt-1 text-sm uppercase tracking-[0.25em]"
            style={{
              color: "rgba(0,0,0,0.45)",
            }}
          >
            {formattedDate}
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-20px font-reguler text-[#C43870]">
          Mood & Statistic
        </h2>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_1fr_1.55fr_1.05fr]">
          <div className="rounded-xl border border-[#FF9FC5] bg-white p-3">
            <h3 className="mb-3 text-center text-20px font-bold text-black">
              Mood Check In
            </h3>

            <div className="mx-auto max-w-[260px] space-y-2">
              {phases.map((phase) => {
                const phaseLog = getPhaseLog(phase);
                const isSaved = Boolean(phaseLog);

                return (
                  <button
                    key={phase}
                    type="button"
                    onClick={() => openCheckIn(phase)}
                    className={`flex w-full items-center justify-between rounded-lg px-5 py-1 text-left text-lg transition ${
                      isSaved
                        ? "bg-[#F5A4C6] text-[#3A1A2E]"
                        : "bg-[#FDECF3] text-[#7A4A62] hover:bg-[#FFD6E7]"
                    }`}
                  >
                    <span>{phase}</span>
                    <span className="text-xl">
                      {isSaved ? getMoodEmoji(phaseLog.mood) : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center rounded-xl border border-[#FF9FC5] bg-white px-4 py-3">
              <h3 className="text-center text-[20px] font-bold leading-none text-black">
                <span className="block">Average</span>
                <span className="block">Energy</span>
              </h3>
              <div className="h-14 w-px bg-[#FF9FC5]" />
              <p className="text-center text-4xl font-bold text-black">
                {averageEnergy}
              </p>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center rounded-xl border border-[#FF9FC5] bg-white px-4 py-3">
              <h3 className="text-center text-[20px] font-bold leading-none text-black">
                <span className="block">Task</span>
                <span className="block">Done</span>
              </h3>
              <div className="h-14 w-px bg-[#FF9FC5]" />
              <p className="text-center text-4xl font-bold text-black">
                0<span className="text-2xl">/3</span>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#FF9FC5] bg-white p-3">
            <h3 className="mb-3 text-center text-20px font-bold text-black">
              Emotional Summary
            </h3>

            {latestCheckIn ? (
              <div className="mx-auto grid max-w-[460px] grid-cols-[82px_12px_1fr] gap-y-1 text-lg text-black">
                <span className="pl-5">Phase</span>
                <span>:</span>
                <span>{latestCheckIn.phase}</span>
                <span className="pl-5">Mood</span>
                <span>:</span>
                <span>{latestCheckIn.mood}</span>
                <span className="pl-5">Energy</span>
                <span>:</span>
                <span>{latestCheckIn.energy}/10</span>
                <span className="pl-5">Reason</span>
                <span>:</span>
                <span>{latestCheckIn.reason}</span>
              </div>
            ) : (
              <div className="mx-auto grid max-w-[460px] grid-cols-[82px_12px_1fr] gap-y-1 text-lg text-black">
                <span className="pl-5">Phase</span>
                <span>:</span>
                <span>-</span>
                <span className="pl-5">Mood</span>
                <span>:</span>
                <span>-</span>
                <span className="pl-5">Energy</span>
                <span>:</span>
                <span>-</span>
                <span className="pl-5">Reason</span>
                <span>:</span>
                <span>None</span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[#FF9FC5] bg-white p-3">
            <h3 className="mb-3 text-center text-20px font-bold text-black">
              Monthly Streak
            </h3>

            <div className="flex flex-col items-center">
              <div
                className="flex h-30 w-30 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(${streakColor} ${streakPercent}%, #FDECF3 0)`,
                }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: streakColor }}
                  >
                    {streakPercent}%
                  </span>
                </div>
              </div>

              {/* <div className="mt-4 flex items-end gap-1">
                <span
                  className="text-3xl font-bold"
                  style={{ color: streakColor }}
                >
                  {streakCount}
                </span>
                <span className="pb-1 text-lg" style={{ color: streakColor }}>
                  /{MONTHLY_STREAK_TARGET}
                </span>
              </div> */}

              <p className="mt-2 text-l text-black">days check-in</p>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 px-4 py-6">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2
                  className="text-3xl text-[#3A1A2E]"
                  style={{ fontFamily: "DM Serif Display" }}
                >
                  {selectedPhase} Check-in
                </h2>
                <p className="mt-1 text-sm text-[#7A4A62]">
                  Take a moment to notice how you feel.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-full bg-[#FFF0F5] px-4 py-2 text-[#C43870] hover:bg-[#FFD6E7]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-medium text-[#7A4A62]">Mood</p>

                <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.english}
                      type="button"
                      onClick={() =>
                        setCheckIn({
                          ...checkIn,
                          mood: `${mood.emoji} ${mood.english}`,
                        })
                      }
                      className={`group relative rounded-2xl border px-3 py-3 text-center text-sm transition ${
                        checkIn.mood === `${mood.emoji} ${mood.english}`
                          ? "border-[#E05589] bg-[#FFD6E7] text-[#3A1A2E]"
                          : "border-[#FFB3CF] bg-[#FFF0F5] text-[#7A4A62] hover:bg-[#FFD6E7]"
                      }`}
                    >
                      <div className="text-xl">{mood.emoji}</div>
                      <div>{mood.english}</div>

                      <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 rounded-xl bg-[#3A1A2E] px-3 py-1 text-xs text-white group-hover:block">
                        {mood.indonesia}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium text-[#7A4A62]">
                  <span>Energy Level </span>
                  <span>| </span>
                  <span>{energyLevel}/10</span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={checkIn.energy}
                  onChange={handleEnergyChange}
                  onInput={handleEnergyChange}
                  style={{ "--energy-progress": energyProgress }}
                  className="energy-slider w-full"
                />

                <div className="mt-0 flex items-center justify-between text-sm text-[#9B6A80]">
                  <span>Low Energy</span>
                  <span>High Energy</span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-[#7A4A62]">
                  Reason
                </p>

                <textarea
                  value={checkIn.reason}
                  onChange={(event) =>
                    setCheckIn({ ...checkIn, reason: event.target.value })
                  }
                  placeholder="What makes you feel this way?"
                  className="h-24 w-full resize-none rounded-2xl border border-[#FFB3CF] bg-[#FFF0F5] p-3 text-sm text-[#3A1A2E] outline-none"
                ></textarea>
              </div>

              <button
                onClick={handleSaveCheckIn}
                className="w-full rounded-2xl bg-[#E05589] px-5 py-3 text-sm font-semibold text-white hover:bg-[#C43870]"
              >
                Save Check-in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
