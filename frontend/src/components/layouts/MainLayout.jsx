import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  HeartPulse,
  CheckSquare,
  Sparkles,
  Archive,
} from "lucide-react";

function MainLayout() {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Journal", path: "/journal", icon: BookOpen },
    { name: "Emotional Tracker", path: "/emotional", icon: HeartPulse },
    { name: "Task Manager", path: "/tasks", icon: CheckSquare },
    { name: "Dream Mission", path: "/dream", icon: Sparkles },
    { name: "Memory Vault", path: "/memory", icon: Archive },
  ];

  return (
    <div className="flex min-h-screen bg-[#FFF0F5]">
      <aside className="w-72 bg-white px-8 py-8">
    
        <div className="text-center">
        <h1
            className="text-[28px] leading-none"
            style={{ fontFamily: "DM Serif Display" }}
        >
            <span className="italic text-[#C43870]">Maziya&apos;s</span>{" "}
            <span className="text-black">System</span>
        </h1>

        <p
            className="mt-2 text-[14px] font-medium"
            style={{
            letterSpacing: "0.30em",
            color: "rgba(0,0,0,0.5)",
            }}
        >
            MY PERSONAL OS
        </p>
        </div>

        <hr className="my-5 border-[#EAEAEA]" />

        <nav className="space-y-3">
          {menuItems.map((item) => (
            <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-5 py-3 text-[16px] font-medium transition ${
                    isActive
                        ? "bg-[#C43870] text-white shadow-sm"
                        : "text-[#7A4A62] hover:bg-[#FFF0F5] hover:text-[#C43870]"
                    }`
                }
                >
                <item.icon size={20} />
                <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-[#FFF0F5] p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;