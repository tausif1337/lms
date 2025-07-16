import React from "react";

function Sidebar({ sidebarOpen, setSidebarOpen, navItems }) {
  return (
    <aside
      className={`h-screen flex flex-col py-6 px-2 transition-all duration-300 bg-white ${
        sidebarOpen ? "w-56" : "w-16"
      } border-r border-gray-100 shadow-sm`}
    >
      {/* Logo/title and collapse button */}
      <div className="flex items-center justify-between mb-6 px-2">
        <span className="text-blue-600 font-extrabold text-xl tracking-tight">
          {sidebarOpen ? "LMS App" : "L"}
        </span>
        <button
          className="flex items-center justify-center rounded-lg hover:bg-blue-50 transition h-8 w-8"
          onClick={() => setSidebarOpen((v) => !v)}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-2 mt-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all text-left font-medium group 
              ${item.active ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"} 
              ${sidebarOpen ? "" : "justify-center px-2"}`}
            onClick={item.onClick}
          >
            <span className="flex justify-center w-6">{item.icon}</span>
            {sidebarOpen && <span className="ml-1">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;