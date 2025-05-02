Write-Output "Activando entorno virtual..."
& .\env\Scripts\Activate.ps1

Write-Output "Iniciando servidor Django..."
Start-Process powershell -ArgumentList "cd backend; python manage.py runserver"

Start-Sleep -Seconds 3  

Write-Output "Iniciando servidor React..."
cd frontend
npm start