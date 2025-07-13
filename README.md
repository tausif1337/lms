# Learning Management System (LMS)

A simple Learning Management System for beginners to learn Django and React.

## 🚀 Quick Start (5 minutes)

### Step 1: Start the Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python manage.py runserver
```

### Step 2: Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### Step 3: Create an Account
1. Go to: http://localhost:5173/register
2. Fill in your details and choose your role
3. Click "Create Account"

### Step 4: Login
1. Go to: http://localhost:5173/login
2. Use your username and password to login
3. You'll see your dashboard!

## 📖 What This Project Teaches You

### Backend (Django)
- How to create a REST API
- User authentication with JWT tokens
- Database models and relationships
- File uploads (images, videos, documents)
- Role-based permissions

### Frontend (React)
- How to build a modern web app
- User authentication and protected routes
- API calls with axios
- Form handling and validation
- **Modern styling with Tailwind CSS**

## 🔐 Simple Authentication System

### Easy Registration
- **No admin setup needed** - Users can register themselves
- **Role selection** - Choose to be a Student or Teacher
- **Form validation** - Real-time error checking
- **Password confirmation** - Prevents typos

### Simple Login
- **Username/password** - Standard login
- **Token-based** - Secure JWT authentication
- **Auto-refresh** - Tokens refresh automatically
- **Error handling** - Clear error messages

### User Roles
- **Student**: Can view and enroll in courses
- **Teacher**: Can create and manage courses
- **Admin**: Can manage everything (created via admin panel)

## 🏗️ Project Structure (Simple)

```
lms/
├── backend/          # Django server (handles data)
│   ├── core/        # Courses, lessons, materials
│   ├── users/       # User accounts
│   └── manage.py    # Django commands
├── frontend/        # React app (handles UI)
│   ├── src/
│   │   ├── pages/   # Login, Register, Dashboard pages
│   │   └── App.jsx  # Main app
│   └── package.json
└── README.md
```

## 👥 User Roles (Simple)

- **Student**: Can view courses and enroll
- **Teacher**: Can create and manage courses
- **Admin**: Can manage everything

## 🔧 How It Works (Simple)

1. **User registers** → Account created in database
2. **User logs in** → Gets a special token
3. **Token is used** → To access protected pages
4. **Backend checks** → If token is valid
5. **Frontend shows** → Different content based on role

## 📱 What You Can Do

### As a Student:
- Register for a new account
- Login to your account
- View available courses
- Enroll in courses
- Watch lesson videos
- Download materials

### As a Teacher:
- Register for a new account
- Login to your account
- Create new courses
- Upload lesson videos
- Add course materials
- See student enrollments

### As an Admin:
- Manage all users
- Create course categories
- Monitor the entire system

## 🛠️ Development (For Beginners)

### Backend Files to Look At:
- `backend/core/models.py` - Database structure
- `backend/core/views.py` - API endpoints
- `backend/core/urls.py` - URL routing

### Frontend Files to Look At:
- `frontend/src/pages/LoginPage.jsx` - Login form (with Tailwind CSS)
- `frontend/src/pages/RegisterPage.jsx` - Registration form (with Tailwind CSS)
- `frontend/src/pages/DashboardPage.jsx` - User dashboard (with Tailwind CSS)
- `frontend/src/App.jsx` - Main app structure

## 🎨 Styling with Tailwind CSS

This project uses **Tailwind CSS** for styling, which means:
- **No custom CSS files** - everything is styled with utility classes
- **Responsive design** - works on all screen sizes
- **Modern look** - beautiful gradients and animations
- **Easy to customize** - just change the classes

### Example Tailwind Classes:
- `bg-blue-500` - Blue background
- `text-white` - White text
- `rounded-lg` - Rounded corners
- `hover:bg-blue-600` - Darker blue on hover
- `animate-spin` - Spinning animation

## 🐛 Common Issues & Solutions

### "Module not found" error
```bash
# Make sure you're in the right directory
cd backend
pip install -r requirements.txt
```

### "npm command not found"
```bash
# Install Node.js from: https://nodejs.org/
# Then run:
cd frontend
npm install
```

### "Port already in use"
```bash
# Backend: Change port
python manage.py runserver 8001

# Frontend: Change port
npm run dev -- --port 3000
```

### "Username already exists"
- Choose a different username
- Try adding numbers (john123, john_2024)

### "Invalid credentials"
- Check your username and password
- Make sure caps lock is off

## 📚 Learning Path

1. **Start here**: Run the project and play with it
2. **Register**: Create different types of accounts
3. **Understand**: Look at the code and comments
4. **Modify**: Try changing colors, text, or adding features
5. **Build**: Create your own features

## 🎯 Next Steps

Once you understand this project, try:
- Adding a password reset feature
- Creating a course catalog
- Adding a search feature
- Building a video player
- Adding notifications
- **Customizing the Tailwind design**

## 💡 Tips for Beginners

- **Don't worry** about understanding everything at once
- **Start small** - just get it running first
- **Experiment** - change things and see what happens
- **Ask questions** - Google is your friend
- **Take breaks** - learning takes time
- **Try Tailwind** - change colors and styles easily
- **Test different roles** - create multiple accounts

## 🔗 Useful Links

- [Django Tutorial](https://docs.djangoproject.com/en/stable/intro/tutorial01/)
- [React Tutorial](https://react.dev/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JWT Authentication](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Authentication Guide](./AUTH_GUIDE.md) - Detailed auth explanation

## 🤝 Need Help?

1. Check the error messages carefully
2. Make sure all dependencies are installed
3. Verify you're in the correct directory
4. Check that both servers are running
5. Look at the browser console for errors
6. Read the [Authentication Guide](./AUTH_GUIDE.md)

---

**Remember**: Every expert was once a beginner. Take your time and enjoy learning! 🎉 