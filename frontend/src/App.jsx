// ============================================================================
// 🚀 MAIN APP COMPONENT
// ============================================================================
// This is the root component of our Learning Management System.
// It sets up routing, authentication, and the overall app structure.

// Import React Router components for navigation
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import our authentication context (manages user login state)
import { AuthProvider } from './contexts/AuthContext';

// Import our protected route component (keeps unauthorized users out)
import ProtectedRoute from './components/ProtectedRoute';

// Import our page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// ============================================================================
// 🎯 APP COMPONENT
// ============================================================================
// This function component is the main entry point of our app.
// It returns the JSX that React will render to the screen.

function App() {
  return (
    // AuthProvider wraps our entire app to provide authentication state
    // to all child components
    <AuthProvider>
      {/* Router enables navigation between different pages */}
      <Router>
        {/* Main app container with styling */}
        <div className="App min-h-screen bg-gray-50">
          {/* Routes define which component to show at which URL */}
          <Routes>
            {/* Login page - accessible to everyone */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Registration page - accessible to everyone */}
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Dashboard page - only accessible to logged-in users */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Default route - redirects to login if not logged in */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Export the App component so it can be imported in main.jsx
export default App;

// ============================================================================
// 📋 HOW THE APP WORKS
// ============================================================================
// 
// 1. 🏠 When the app starts:
//    - AuthProvider checks if user is already logged in
//    - If logged in, user data is loaded from browser storage
//    - If not logged in, user sees the login page
//
// 2. 🔐 Authentication Flow:
//    - Users can register for a new account
//    - Users can log in with username and password
//    - After successful login, users are redirected to dashboard
//    - Authentication tokens are stored in browser storage
//
// 3. 🛡️ Protected Routes:
//    - Dashboard and other private pages are wrapped in ProtectedRoute
//    - If user tries to access protected page without being logged in,
//      they are automatically redirected to login page
//
// 4. 🧭 Navigation:
//    - React Router handles all page navigation
//    - Users can navigate between login, register, and dashboard
//    - URL changes reflect the current page
//
// 5. 🎨 Styling:
//    - Tailwind CSS provides all the styling classes
//    - Global styles are imported from styles/globals.css
//    - Responsive design works on all screen sizes
//
// ============================================================================
// 🎯 NEXT STEPS FOR BEGINNERS
// ============================================================================
// 
// To understand this app better, explore these files in order:
// 
// 1. 📄 pages/LoginPage.jsx - See how forms work
// 2. 📄 contexts/AuthContext.jsx - Understand state management
// 3. 📄 components/ProtectedRoute.jsx - Learn about route protection
// 4. 📄 services/api.js - See how we talk to the backend
// 5. 📄 hooks/useAuth.js - Learn about custom React hooks
//
// Each file has detailed comments explaining what it does!
