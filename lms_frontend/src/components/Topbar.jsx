import React from "react";
import Avatar from "./Avatar";

function Topbar({ user, showProfile, setShowProfile, logout, setCurrentPage }) {
  return (
    <header
      className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 w-full shadow-sm"
      style={{ minHeight: "64px" }}
    >
      <div className="flex-1"></div>
      <div className="relative flex-1 flex justify-end">
        <button
          className="flex items-center gap-3 focus:outline-none rounded-full hover:bg-blue-50 px-3 py-2 transition"
          onClick={() => setShowProfile((v) => !v)}
        >
          <Avatar name={user.username} />
          <span className="hidden sm:block font-medium text-gray-700 text-sm">
            {user.username}
          </span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showProfile && (
          <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 animate-fade-in">
            <div className="p-4 border-b border-gray-100">
              <div className="font-semibold text-gray-700">{user.username}</div>
              <div className="text-xs text-gray-400">{user.email}</div>
              <div className="text-xs text-blue-500 capitalize mt-1">{user.role}</div>
            </div>
            <button
              className="w-full text-left px-4 py-2 hover:bg-blue-100 text-sm transition"
              onClick={() => {
                setShowProfile(false);
                setCurrentPage("profile");
              }}
            >
              Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-500 transition"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;