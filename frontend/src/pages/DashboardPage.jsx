import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learning Management System
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">
                Welcome, {user.username} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Welcome section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to your Dashboard
            </h2>
            <p className="text-gray-600">
              You are logged in as: <span className="font-semibold text-blue-600">{user.role}</span>
            </p>
          </div>

          {/* User details section */}
          <div className="mb-8 bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span className="text-gray-600 font-medium">Username:</span>
                <span className="text-gray-900 font-semibold">{user.username}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-900 font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span className="text-gray-600 font-medium">Role:</span>
                <span className="text-gray-900 font-semibold capitalize">{user.role}</span>
              </div>
              {user.mobile_no && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-gray-600 font-medium">Mobile:</span>
                  <span className="text-gray-900 font-semibold">{user.mobile_no}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick actions section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                View Courses
              </button>
              <button className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 transform hover:scale-105 transition-all duration-200">
                My Enrollments
              </button>
              {user.role === 'teacher' && (
                <button className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 transform hover:scale-105 transition-all duration-200">
                  Manage Courses
                </button>
              )}
              {user.role === 'admin' && (
                <button className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 transform hover:scale-105 transition-all duration-200">
                  Admin Panel
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 