"use client";
import React from "react";
import Link from "next/link";
import { Menu, FileEdit, LineChart, Store, Settings, LogOut,  } from "lucide-react";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, handleLogout }) => {
  return (
    <div className="w-64 bg-zinc-800 text-gray-100 py-6 px-4 flex flex-col border-r border-zinc-700">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-violet-300">Restaurant Name</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveView("orders")}
              className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded ${
                activeView === "orders"
                  ? "bg-zinc-700 text-violet-300"
                  : "text-gray-300 hover:bg-zinc-700 hover:text-violet-300"
              } transition-colors`}
            >
              <Menu size={18} />
              <span>Orders</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView("editMenu")}
              className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded ${
                activeView === "editMenu"
                  ? "bg-zinc-700 text-violet-300"
                  : "text-gray-300 hover:bg-zinc-700 hover:text-violet-300"
              } transition-colors`}
            >
              <FileEdit size={18} />
              <span>Edit Menu</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView("statistics")}
              className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded ${
                activeView === "statistics"
                  ? "bg-zinc-700 text-violet-300"
                  : "text-gray-300 hover:bg-zinc-700 hover:text-violet-300"
              } transition-colors`}
            >
              <LineChart size={18} />
              <span>Statistics</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="mt-6 border-t border-zinc-700 pt-6">
        <Link
          href={`/dashboard`}
          className="flex items-center gap-2 text-gray-300 hover:text-violet-300 transition-colors mb-4"
        >
          <Store size={18} />
          <span>Back to Restaurants</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-300 hover:text-violet-300 transition-colors mb-4"
        >
          <
          <span>Go to Consumer Site</span>
        </Link>
      </div>

      <div className="mt-auto space-y-3">
        <Link href="/settings" className="block">
          <div className="px-4 py-2.5 rounded-lg bg-zinc-700 text-gray-100 text-center hover:bg-zinc-600 transition-colors flex items-center justify-center gap-2">
            <Settings size={18} />
            <span>Settings</span>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2.5 rounded-lg bg-zinc-700 text-gray-100 hover:bg-zinc-600 transition-colors w-full flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
