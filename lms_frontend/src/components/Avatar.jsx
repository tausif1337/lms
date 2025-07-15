import React from "react";

const Avatar = ({ name }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '?';
  return (
    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow">
      {initials}
    </div>
  );
};

export default Avatar; 