// ============================================================================
// 🚀 REACT APP ENTRY POINT
// ============================================================================
// This is where our React application starts. It's like the "main" function
// in other programming languages.

// Import React's StrictMode for better development experience
import { StrictMode } from 'react'

// Import the function to create a React root (this is how we render our app)
import { createRoot } from 'react-dom/client'

// Import our main App component (this is the root of our component tree)
import App from './App.jsx'

// Import our global styles (this gives us all the CSS we need)
import './index.css'

// ============================================================================
// 🎯 APP INITIALIZATION
// ============================================================================

// Find the HTML element where we want to render our React app
// This element should have the id "root" in your index.html file
const rootElement = document.getElementById('root')

// Create a React root from that element
const root = createRoot(rootElement)

// Render our App component inside the root
// StrictMode helps us catch potential problems during development
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// ============================================================================
// 📋 WHAT HAPPENS NEXT
// ============================================================================
// 1. React renders the <App /> component
// 2. App.jsx sets up routing and authentication
// 3. Users see the login page first
// 4. After login, they see the dashboard
// 5. The app continues running and responding to user actions
