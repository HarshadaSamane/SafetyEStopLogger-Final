# 🚀 Quick Start Guide - Safety E-Stop System

## Step-by-Step Setup Instructions

### ✅ Backend Setup (Already Done)

Your .NET API is ready with CORS enabled!

### 🎨 Frontend Setup

#### 1️⃣ Navigate to Frontend Folder
```bash
cd frontend
```

#### 2️⃣ Install Dependencies
```bash
npm install
```

This will install:
- React 18
- React Router v6
- Axios
- TailwindCSS
- Lucide Icons
- Sonner (Toasts)
- Vite

#### 3️⃣ Start Development Server
```bash
npm run dev
```

✅ Frontend will start at: `http://localhost:3000`

---

## 🎯 How to Run Both Servers

### Option 1: Two Terminals

**Terminal 1 - Backend:**
```bash
cd SafetyEStopSystem.API
dotnet run
```
✅ Backend runs on: `http://localhost:5260`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend runs on: `http://localhost:3000`

### Option 2: Visual Studio + Terminal

1. **Run Backend from Visual Studio** (F5)
2. **Run Frontend from Terminal:**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🧪 Testing the Complete System

### Test 1: Public E-Stop (No Login Required)
1. Open browser: `http://localhost:3000/public-estop`
2. You should see the E-Stop button page
3. Select a station (if any exist)
4. Press the E-Stop button
5. ✅ Incident should be created

### Test 2: Register Admin User
1. Navigate to: `http://localhost:3000/register`
2. Fill in details:
   - Full Name: **Admin User**
   - Employee ID: **ADM001**
   - Email: **admin@example.com**
   - Password: **Admin@123**
   - Role: **Admin**
3. Click "Create Account"
4. ✅ You'll be redirected to login

### Test 3: Login as Admin
1. Navigate to: `http://localhost:3000/login`
2. Enter credentials:
   - Email: **admin@example.com**
   - Password: **Admin@123**
3. Click "Sign In"
4. ✅ You'll see the Admin Dashboard

### Test 4: Create a Station
1. In the dashboard, click **"Create New Station"**
2. Enter details:
   - Station Name: **Station A**
   - Location: **Building 1, Floor 2**
3. Click "Create Station"
4. ✅ Station appears in the "All Stations" section

### Test 5: Press E-Stop from Public Page
1. Open new tab: `http://localhost:3000/public-estop`
2. Select "Station A" from dropdown
3. Enter your name: **Factory Worker**
4. Click "🚨 PRESS E-STOP"
5. Confirm the alert
6. ✅ Success message appears

### Test 6: View & Manage Incident
1. Go back to Admin Dashboard
2. You should see the new incident in "Active Incidents"
3. Click **"Acknowledge"** button
4. ✅ Status changes to "Acknowledged"
5. Click **"Close"** button
6. ✅ Incident is closed and removed from active list

---

## 📋 Common Commands

### Frontend Commands
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Commands
```bash
# Run the API
dotnet run

# Build the project
dotnet build

# Update database
dotnet ef database update
```

---

## 🎨 Features Overview

### 🌐 Public Access
- **Public E-Stop Page** - Anyone can press E-Stop without login
- **Station Selection** - Choose from active stations
- **Anonymous or Named** - Optionally provide your name

### 🔐 Authenticated Access

#### Admin Features:
- ✅ View dashboard with statistics
- ✅ Create new stations
- ✅ View all active incidents
- ✅ Acknowledge incidents
- ✅ Close incidents
- ✅ Reset stations
- ✅ View all stations

#### Supervisor Features:
- ✅ View incidents
- ✅ Acknowledge incidents
- ✅ Close incidents

#### Operator Features:
- ✅ Press E-Stop button
- ✅ View active alerts

---

## 🔧 Troubleshooting

### ❌ Problem: "Cannot connect to API"
**Solution:**
- Make sure backend is running on port 5260
- Check `http://localhost:5260/swagger` is accessible
- Verify CORS is enabled in backend

### ❌ Problem: "npm install fails"
**Solution:**
```bash
# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

### ❌ Problem: "Port 3000 already in use"
**Solution:**
```bash
# The error will show which port is available
# Or kill the process using port 3000
```

### ❌ Problem: "Login not working"
**Solution:**
- Check browser console for errors
- Verify backend API is running
- Check database has user records

---

## 📱 Accessing from Mobile/Other Devices

### Find your IP address:
**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address"

**Mac/Linux:**
```bash
ifconfig
```

### Update CORS in Backend:
Add your IP to `Program.cs`:
```csharp
policy.WithOrigins("http://localhost:3000", "http://192.168.1.100:3000")
```

### Access from phone:
```
http://192.168.1.100:3000
```
(Replace with your actual IP)

---

## 🎯 Next Steps

1. ✅ **Customize the UI** - Edit colors in `tailwind.config.js`
2. ✅ **Add More Features** - Create additional pages/components
3. ✅ **Deploy** - Build and deploy to production server
4. ✅ **Add Charts** - Install Chart.js for analytics
5. ✅ **Mobile App** - Convert to React Native

---

## 📞 Support

If you encounter any issues:
1. Check the README.md in the frontend folder
2. Check browser console for errors
3. Check backend logs in Visual Studio
4. Verify all services are running

---

**🎉 Congratulations! Your Safety E-Stop System is ready to use!**
