import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";

function DreamMission() {
  const STORAGE_KEY = "maziyas_dream_mission";

  const [mission, setMission] = useState({
    title: "Dubai Mission",
    why: "Meet someone important and finish what must be finished.",
    targetDate: "2027-12-31",
    nextAction: "Update CV",
    milestones: [],
  });

  const [newMilestone, setNewMilestone] = useState("");

  useEffect(() => {
    const savedMission = localStorage.getItem(STORAGE_KEY);
    if (savedMission) setMission(JSON.parse(savedMission));
  }, []);

  const saveMission = (updatedMission) => {
    setMission(updatedMission);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMission));
  };

  const handleAddMilestone = () => {
    if (!newMilestone.trim()) return;

    const updatedMission = {
      ...mission,
      milestones: [
        ...mission.milestones,
        {
          id: Date.now(),
          title: newMilestone,
          completed: false,
        },
      ],
    };

    saveMission(updatedMission);
    setNewMilestone("");
  };

  const handleToggleMilestone = (id) => {
    const updatedMission = {
      ...mission,
      milestones: mission.milestones.map((milestone) =>
        milestone.id === id
          ? { ...milestone, completed: !milestone.completed }
          : milestone
      ),
    };

    saveMission(updatedMission);
  };

  const handleDeleteMilestone = (id) => {
    const updatedMission = {
      ...mission,
      milestones: mission.milestones.filter(
        (milestone) => milestone.id !== id
      ),
    };

    saveMission(updatedMission);
  };

  const completedMilestones = mission.milestones.filter(
    (milestone) => milestone.completed
  ).length;

  const progress =
    mission.milestones.length > 0
      ? Math.round((completedMilestones / mission.milestones.length) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-5xl text-black"
          style={{ fontFamily: "DM Serif Display" }}
        >
          Dream Mission
        </h1>

        <p className="mt-2 text-[#7A4A62]">
          One step closer every day.
        </p>
      </div>

      <div className="rounded-3xl border border-[#FFB3CF] bg-white p-8">
        <h2
          className="text-3xl text-[#C43870]"
          style={{ fontFamily: "DM Serif Display" }}
        >
          🇦🇪 {mission.title}
        </h2>

        <p className="mt-4 text-[#7A4A62]">{mission.why}</p>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm font-semibold text-[#7A4A62]">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-3 rounded-full bg-[#FFD6E7]">
            <div
              className="h-3 rounded-full bg-[#C43870]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#FFF0F5] p-4">
            <p className="text-sm text-[#B07A95]">Total Milestones</p>
            <p className="text-2xl font-bold text-[#C43870]">
              {mission.milestones.length}
            </p>
          </div>

          <div className="rounded-2xl bg-[#FFF0F5] p-4">
            <p className="text-sm text-[#B07A95]">Completed</p>
            <p className="text-2xl font-bold text-[#C43870]">
              {completedMilestones}
            </p>
          </div>

          <div className="rounded-2xl bg-[#FFF0F5] p-4">
            <p className="text-sm text-[#B07A95]">Target Date</p>
            <p className="text-lg font-bold text-[#C43870]">
              {mission.targetDate}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#FFB3CF] bg-white p-8">
        <h3 className="mb-4 text-xl font-bold text-[#3A1A2E]">
          Milestones
        </h3>

        <div className="mb-6 flex gap-3">
          <input
            type="text"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            placeholder="Add milestone..."
            className="flex-1 rounded-2xl border border-[#FFB3CF] bg-[#FFF0F5] px-4 py-3 text-sm outline-none focus:border-[#C43870]"
          />

          <button
            onClick={handleAddMilestone}
            className="rounded-2xl bg-[#C43870] px-5 py-3 text-white hover:bg-[#E05589]"
          >
            <Plus size={18} />
          </button>
        </div>

        {mission.milestones.length === 0 ? (
          <div className="rounded-2xl bg-[#FFF0F5] p-6 text-center text-[#7A4A62]">
            Belum ada milestone.
          </div>
        ) : (
          <div className="space-y-3">
            {mission.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center justify-between rounded-2xl border border-[#FFD6E7] p-4"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={milestone.completed}
                    onChange={() => handleToggleMilestone(milestone.id)}
                  />

                  <span
                    className={
                      milestone.completed
                        ? "text-[#B07A95] line-through"
                        : "text-[#3A1A2E]"
                    }
                  >
                    {milestone.title}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteMilestone(milestone.id)}
                  className="rounded-xl border border-[#EAEAEA] p-3 text-[#3A1A2E] hover:bg-[#FFF0F5] hover:text-[#C43870]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DreamMission;