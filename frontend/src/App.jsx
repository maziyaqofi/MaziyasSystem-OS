import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import EmotionalTracker from "./pages/EmotionalTracker";
import TaskManager from "./pages/TaskManager";
import DreamMission from "./pages/DreamMission";
import MemoryVault from "./pages/MemoryVault";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/emotional" element={<EmotionalTracker />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/dream" element={<DreamMission />} />
          <Route path="/memory" element={<MemoryVault />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;