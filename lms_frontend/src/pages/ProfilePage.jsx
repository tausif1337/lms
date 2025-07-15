import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import Avatar from "../components/Avatar";

// Simple Modal component
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] relative animate-fadeIn">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

function ProfilePage() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]); // For admin: all users
  const [editUserId, setEditUserId] = useState(null); // Track which user is being edited
  const [form, setForm] = useState({ username: "", email: "", role: "", password: "" });
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/user/auth/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setUsers(data);
          setProfile(null);
        } else {
          setProfile(data);
          setForm({
            username: data?.username || "",
            email: data?.email || "",
            role: data?.role || "",
            password: ""
          });
        }
      });
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.put("http://localhost:8000/api/user/auth/", form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Profile updated!");
      setEditUserId(null);
    } catch {
      setMessage("Update failed.");
    }
  };

  const handleAdminEdit = (user) => {
    setEditUserId(user.id);
    setForm({
      username: user.username,
      email: user.email,
      role: user.role,
      password: ""
    });
  };

  const handleAdminDelete = (userId) => {
    setConfirmDelete(userId);
  };

  const confirmDeleteUser = () => {
    // Placeholder: show alert
    alert(`Delete user with id ${confirmDelete} (not implemented)`);
    setConfirmDelete(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  if (users.length > 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl text-center">
        <h2 className="text-2xl font-bold mb-6 text-green-600">All Users</h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-50">
              <tr>
                <th className="border px-4 py-2 text-left">Avatar</th>
                <th className="border px-4 py-2 text-left">Username</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Role</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border px-4 py-2"><Avatar name={user.username} /></td>
                  <td className="border px-4 py-2 font-semibold">{user.username}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2 capitalize">{user.role}</td>
                  <td className="border px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="bg-yellow-400 text-white py-1 px-3 rounded-lg hover:bg-yellow-500 transition text-sm shadow"
                      title="Edit user"
                      onClick={() => handleAdminEdit(user)}
                    >Edit</button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition text-sm shadow"
                      title="Delete user"
                      onClick={() => handleAdminDelete(user.id)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editUserId && (
          <Modal onClose={() => setEditUserId(null)}>
            <h3 className="text-lg font-bold mb-4 text-blue-600">Edit User</h3>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 items-center">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                readOnly
              />
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <select
                className="w-full px-4 py-2 border border-blue-300 rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold text-blue-700"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter new password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              <button className="bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition shadow w-full" type="submit">Save</button>
              <button className="bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition w-full" type="button" onClick={() => setEditUserId(null)}>Cancel</button>
            </form>
            {message && <div className="mt-3 text-center text-sm text-green-500">{message}</div>}
          </Modal>
        )}
        {confirmDelete && (
          <Modal onClose={() => setConfirmDelete(null)}>
            <h3 className="text-lg font-bold mb-4 text-red-600">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex gap-4 justify-center">
              <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition font-semibold" onClick={confirmDeleteUser}>Yes, Delete</button>
              <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-semibold" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </Modal>
        )}
        <button className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition mt-8 font-semibold shadow" onClick={logout}>Logout</button>
      </div>
    );
  }

  if (!profile) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xs text-center flex flex-col items-center">
      <Avatar name={profile.username} />
      <h2 className="text-2xl font-bold mb-2 mt-4 text-green-600">Profile</h2>
      {editUserId ? (
        <form onSubmit={handleUpdate} className="flex flex-col gap-4 w-full mt-2">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            readOnly
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <select
            className="w-full px-4 py-2 border border-blue-300 rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold text-blue-700"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Enter new password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <button className="bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition shadow" type="submit">Save</button>
        </form>
      ) : (
        <div className="w-full flex flex-col items-center mt-4">
          <div className="mb-2 text-lg font-semibold text-gray-700">{profile.username}</div>
          <div className="mb-1 text-gray-500">{profile.email}</div>
          <div className="mb-4 text-sm text-blue-500 capitalize">{profile.role}</div>
          <button className="bg-yellow-400 text-white py-2 px-6 rounded-lg hover:bg-yellow-500 transition font-semibold shadow mb-2" onClick={() => setEditUserId(profile.id)}>Edit</button>
        </div>
      )}
      <button className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition mt-4 font-semibold shadow" onClick={logout}>Logout</button>
      {message && <div className="mt-3 text-center text-sm text-green-500">{message}</div>}
    </div>
  );
}

export default ProfilePage;
