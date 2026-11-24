@echo off
where mvn >nul 2>nul
if errorlevel 1 (
  echo Maven chua duoc cai dat hoac chua co trong PATH.
  echo Hay mo project bang IntelliJ IDEA va chay Maven, hoac cai Maven 3.9.x.
  pause
  exit /b 1
)
mvn spring-boot:run
