@echo off
echo Starting Multilingual Chatbot Development Environment...
echo.

echo Starting MongoDB (make sure MongoDB is installed and running)
echo.

echo Starting Backend Server...
cd BACK-END
start "Backend Server" cmd /k "npm run dev"
cd ..

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
cd FRONT-END
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo Both servers should be starting now!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause