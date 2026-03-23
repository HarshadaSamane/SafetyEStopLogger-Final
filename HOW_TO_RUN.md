# 🚀 How to Run the Full Stack Application

## 🎯 **Option 1: Automatic Startup (EASIEST!)**

### **Method A: Double-Click Batch File**
1. Find `START_FULLSTACK.bat` in your project root
2. **Double-click it**
3. ✅ Backend starts automatically
4. ✅ Frontend starts automatically
5. ✅ Browser opens to http://localhost:3000

### **Method B: PowerShell Script**
1. Right-click `START_FULLSTACK.ps1`
2. Select **"Run with PowerShell"**
3. Both servers start and browser opens!

---

## 🎯 **Option 2: Visual Studio + Terminal**

### **Step 1: Start Backend from Visual Studio**
1. Open Visual Studio
2. Press **F5** or click **Start**
3. ✅ Backend API runs on http://localhost:5260
4. ✅ Browser now opens to http://localhost:3000 (frontend)

### **Step 2: Start Frontend Manually**
If frontend isn't running yet:
1. Open **Terminal** in Visual Studio (Ctrl + `)
2. Run:
```powershell
cd frontend
npm run dev
```
3. ✅ Frontend starts on http://localhost:3000

---

## 🎯 **Option 3: Two Terminals (Manual)**

### **Terminal 1 - Backend:**
```powershell
cd SafetyEStopSystem.API
dotnet run
```
✅ Runs on: http://localhost:5260

### **Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```
✅ Runs on: http://localhost:3000

---

## 📋 **Verify Everything Works**

### ✅ Backend Running:
Open: http://localhost:5260/swagger
- You should see Swagger UI with all API endpoints

### ✅ Frontend Running:
Open: http://localhost:3000
- You should see the Login page

### ✅ Connection Working:
1. Go to http://localhost:3000/public-estop
2. If stations load, connection is working! ✅

---

## 🐛 **Troubleshooting**

### ❌ "Frontend not loading"
**Solution:**
```powershell
cd frontend
npm install
npm run dev
```

### ❌ "Backend not starting"
**Solution:**
1. Stop Visual Studio debugging
2. Close any running dotnet processes
3. Press F5 again

### ❌ "Port already in use"
**Solution - Backend (5260):**
```powershell
# Find and kill process on port 5260
netstat -ano | findstr :5260
taskkill /PID <PID_NUMBER> /F
```

**Solution - Frontend (3000):**
```powershell
# Use different port
cd frontend
npm run dev -- --port 3001
```

### ❌ "Can't connect to backend from frontend"
**Solution:**
1. Check backend is running: http://localhost:5260/swagger
2. Check CORS is enabled in Program.cs (already done! ✅)
3. Check browser console for errors (F12)

---

## 🎨 **What Opens Where**

| Service | URL | Opens Automatically? |
|---------|-----|----------------------|
| **Backend API** | http://localhost:5260 | ❌ (runs in background) |
| **Swagger UI** | http://localhost:5260/swagger | ❌ (manual access) |
| **Frontend** | http://localhost:3000 | ✅ YES! |

---

## 💡 **Pro Tips**

### Keep Both Running:
- Leave both terminal windows open
- Don't close them until you're done testing

### Quick Restart:
- **Backend**: Press Shift+F5, then F5 in Visual Studio
- **Frontend**: Press Ctrl+C in terminal, then `npm run dev`

### Access Swagger:
- Even though frontend opens automatically
- You can still access Swagger at: http://localhost:5260/swagger

### View Logs:
- **Backend**: Visual Studio Output window
- **Frontend**: Terminal where you ran `npm run dev`

---

## 📱 **Testing URLs**

Once both servers are running, test these:

1. **Login Page**: http://localhost:3000/login
2. **Register**: http://localhost:3000/register
3. **Public E-Stop**: http://localhost:3000/public-estop ⚠️
4. **Dashboard** (after login): http://localhost:3000/admin/dashboard

---

## 🔄 **Daily Workflow**

### Morning Start:
```powershell
# Option 1: Use startup script
START_FULLSTACK.bat

# Option 2: Manual
# Terminal 1:
cd SafetyEStopSystem.API
dotnet run

# Terminal 2:
cd frontend
npm run dev
```

### During Development:
- Edit .NET code → Auto-restarts (hot reload)
- Edit React code → Auto-refreshes (hot reload)
- No need to stop/start!

### Evening Stop:
- Close both terminal windows
- Or press Ctrl+C in each terminal
- Or close PowerShell windows

---

## ✅ **Quick Checklist**

Before starting work:
- [ ] Node.js installed? (`node --version`)
- [ ] .NET 8 installed? (`dotnet --version`)
- [ ] Dependencies installed? (`npm install` in frontend/)
- [ ] Database updated? (`dotnet ef database update`)

Ready to run:
- [ ] Backend: http://localhost:5260 ✅
- [ ] Frontend: http://localhost:3000 ✅
- [ ] Browser opens to frontend automatically ✅

---

## 🎉 **Summary**

**The Easiest Way:**
1. Double-click `START_FULLSTACK.bat`
2. Wait 10 seconds
3. Browser opens to frontend automatically!
4. Start working! 🚀

**Frontend now opens automatically instead of Swagger!** ✅

---

**Need help? Check the console for errors or ask!** 💬
