import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import Avatar from "../components/Avatar";

function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // First check if user is admin using the profile endpoint
        const profileRes = await axios.get("http://localhost:8000/api/user/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = profileRes.data;
        console.log("UsersPage - Current user data:", data);
        if (data.role === "admin") {
          setIsAdmin(true);
          // If admin, fetch all users
          const usersRes = await axios.get("http://localhost:8000/api/user/auth/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const usersData = usersRes.data;
          console.log("UsersPage - All users data:", usersData);
          if (Array.isArray(usersData)) {
            setUsers(usersData);
          }
        } else {
          setIsAdmin(false);
          throw new Error("Access denied");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUsers();
  }, [token]);

  if (!isAdmin) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
        <p className="text-gray-600">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-6xl text-center">
      <h2 className="text-2xl font-bold mb-6 text-green-600">All Users</h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              <th className="border px-4 py-2 text-left">Avatar</th>
              <th className="border px-4 py-2 text-left">Username</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={user.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border px-4 py-2">
                  <Avatar name={user.username} />
                </td>
                <td className="border px-4 py-2 font-semibold">
                  {user.username}
                </td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2 capitalize">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPage;
