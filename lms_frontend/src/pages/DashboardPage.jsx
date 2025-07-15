import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ProfilePage from "./ProfilePage";
import Avatar from "../components/Avatar";

function DashboardPage({ children }) {
  const { logout } = useAuth();
  // Replace with real user/profile fetch if needed
  const user = { username: "User", role: "student", email: "user@email.com" };
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" /></svg>
      ),
      onClick: () => setShowProfile(false),
      active: !showProfile,
    },
    {
      label: "Profile",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      ),
      onClick: () => setShowProfile(true),
      active: showProfile,
    },
  ];

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Sidebar */}
      <aside className={`flex flex-col py-6 px-2 transition-all duration-300 bg-white shadow-lg h-full ${sidebarOpen ? 'w-56' : 'w-16'} rounded-r-3xl relative`}>
        {/* Logo/title */}
        <div className="flex items-center gap-2 mb-10 px-2">
          <span className="text-blue-600 font-extrabold text-xl tracking-tight">{sidebarOpen ? 'LMS App' : 'L'}</span>
        </div>
        <button
          className="mb-8 flex items-center justify-center rounded-lg hover:bg-blue-50 transition h-10 w-10 self-end"
          onClick={() => setSidebarOpen((v) => !v)}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <nav className="flex-1 flex flex-col gap-2 mt-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 py-2 px-3 rounded-xl transition text-left font-medium group ${item.active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'} ${sidebarOpen ? '' : 'justify-center px-2'}`}
              onClick={item.onClick}
            >
              <span>{item.icon}</span>
              {sidebarOpen && <span className="ml-1">{item.label}</span>}
            </button>
          ))}
        </nav>
        {/* Logout at bottom */}
        <button
          className={`absolute bottom-6 left-2 right-2 flex items-center gap-3 py-2 px-3 rounded-xl transition text-left font-medium group text-red-500 hover:bg-red-50 ${sidebarOpen ? '' : 'justify-center px-2'}`}
          onClick={logout}
        >
          <span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
          </span>
          {sidebarOpen && <span className="ml-1">Logout</span>}
        </button>
      </aside>
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white shadow border-b border-gray-100">
          <div className="font-bold text-xl text-blue-700 tracking-tight">Dashboard</div>
          <div className="relative">
            <button className="flex items-center gap-2 focus:outline-none rounded-full hover:bg-blue-50 px-2 py-1 transition" onClick={() => setShowProfile((v) => !v)}>
              <Avatar name={user.username} />
              <span className="hidden sm:block font-semibold text-gray-700">{user.username}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-10 animate-fade-in">
                <div className="p-4 border-b border-gray-100">
                  <div className="font-semibold text-gray-700">{user.username}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                  <div className="text-xs text-blue-500 capitalize mt-1">{user.role}</div>
                </div>
                <button className="w-full text-left px-4 py-2 hover:bg-blue-50 transition" onClick={() => setShowProfile(true)}>Profile</button>
                <button className="w-full text-left px-4 py-2 hover:bg-blue-50 transition text-red-500" onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 p-6 bg-transparent overflow-auto">
          {showProfile ? (
            <ProfilePage />
          ) : (
            children || (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <h2 className="text-3xl font-bold text-blue-600 mb-2">Welcome to your Dashboard!</h2>
                <p className="text-gray-500 text-lg mb-2">Use the sidebar to navigate your LMS features.</p>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}

export default DashboardPage; 