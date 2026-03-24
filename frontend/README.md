# Safety E-Stop System - React Frontend

A professional, modern React frontend for the Safety E-Stop System built with Vite, React Router, TailwindCSS, and Axios.

## 🚀 Features

- ✅ **Authentication System** (Login/Register)
- ✅ **Role-Based Access Control** (Admin, Supervisor, Operator, Maintenance)
- ✅ **Public E-Stop Button** (No login required)
- ✅ **Admin Dashboard** with real-time statistics
- ✅ **Incident Management** (Acknowledge, Close, Reset)
- ✅ **Station Management** (Create, View, Monitor)
- ✅ **Responsive Design** (Mobile, Tablet, Desktop)
- ✅ **Modern UI** with TailwindCSS
- ✅ **Toast Notifications** for user feedback

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:5260`

## 🛠️ Setup Instructions

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Step 3: Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── apiService.js          # API calls and axios configuration
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx          # Login page
│   │   │   └── Register.jsx       # Registration page
│   │   ├── Dashboard/
│   │   │   └── AdminDashboard.jsx # Main dashboard
│   │   ├── Layout/
│   │   │   └── Navbar.jsx         # Navigation bar
│   │   └── Public/
│   │       └── PublicEStop.jsx    # Public E-Stop button
│   ├── context/
│   │   └── AuthContext.jsx        # Authentication context
│   ├── App.jsx                    # Main app with routing
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔑 User Roles & Access

### Admin
- ✅ Create stations
- ✅ View all incidents
- ✅ Acknowledge incidents
- ✅ Close incidents
- ✅ Reset stations
- ✅ View dashboard statistics

### Supervisor
- ✅ View incidents
- ✅ Acknowledge incidents
- ✅ Close incidents
- ✅ View dashboard statistics

### Operator
- ✅ Press E-Stop button
- ✅ View active alerts

### Public (No Login)
- ✅ Press E-Stop button from any active station

## 🎨 UI Components

### Login Page
- Email and password authentication
- Link to registration
- Link to public E-Stop

### Register Page
- Full name, employee ID, email, password
- Role selection (Admin, Supervisor, Operator, Maintenance)
- Password validation

### Admin Dashboard
- **Statistics Cards**: Total stations, open incidents, closed incidents
- **Create Station**: Form to add new stations
- **Active Incidents**: Real-time list with acknowledge/close actions
- **All Stations**: Grid view of all stations with status

### Public E-Stop
- Station selection dropdown
- Optional name input
- Large emergency button
- Safety warning message

## 🔧 Configuration

### API Base URL
Update in `src/api/apiService.js`:
```javascript
const API_BASE_URL = 'http://localhost:5260/api';
```

### CORS Settings
Already configured in backend `Program.cs` to allow:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite default)

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🎯 Key Libraries

- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **Vite** - Build tool

## 🚦 Running Both Backend & Frontend

### Terminal 1 (Backend - .NET API):
```bash
cd SafetyEStopSystem.API
dotnet run
```
API runs on: `http://localhost:5260`

### Terminal 2 (Frontend - React):
```bash
cd frontend
npm run dev
```
App runs on: `http://localhost:3000`

## 🧪 Testing the Application

### 1. Register a User
```
Navigate to: http://localhost:3000/register
- Full Name: John Doe
- Employee ID: EMP001
- Email: john@example.com
- Password: Admin@123
- Role: Admin
```

### 2. Login
```
Navigate to: http://localhost:3000/login
- Email: john@example.com
- Password: Admin@123
```

### 3. Create a Station
- Click "Create New Station"
- Name: Station A
- Location: Building 1, Floor 2
- Click "Create Station"

### 4. Test Public E-Stop
```
Navigate to: http://localhost:3000/public-estop
- Select a station
- Enter your name (optional)
- Press "🚨 PRESS E-STOP"
```

### 5. View Incidents
- Go back to dashboard
- See the new incident in "Active Incidents"
- Click "Acknowledge" or "Close"

## 🐛 Troubleshooting

### CORS Errors
Make sure backend CORS is enabled in `Program.cs`:
```csharp
app.UseCors("AllowReactApp");
```

### API Connection Failed
- Check backend is running on port 5260
- Check `apiService.js` has correct URL
- Check browser console for errors

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      danger: '#your-color',
    }
  }
}
```

### Add New Pages
1. Create component in `src/components/`
2. Add route in `src/App.jsx`
3. Add to navigation if needed

## 📄 License

MIT License - Feel free to use for your projects!

## 👨‍💻 Support

For issues or questions, contact the development team.

---

**Built with ❤️ using React + Vite + TailwindCSS**
