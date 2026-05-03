Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js"
Start-Sleep -Seconds 3
Invoke-RestMethod -Uri "http://localhost:5000/api/symptoms-list"
