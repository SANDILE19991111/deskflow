# DeskFlow API Test Script
# ---------------------------------------------------------
# Usage:
#   1. Start the server in a separate terminal:  npm run dev
#   2. In this terminal, run:                     .\test-api.ps1
#
# If Windows blocks the script from running, first allow it for this session:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
# ---------------------------------------------------------

$baseUrl = "http://localhost:5000"
$pass = 0
$fail = 0

function Invoke-Test {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [hashtable]$Headers = @{},
        [int]$ExpectedStatus
    )

    try {
        if ($Body) {
            $resp = Invoke-WebRequest -Uri $Url -Method $Method -ContentType "application/json" -Headers $Headers -Body $Body -UseBasicParsing -ErrorAction Stop
        } else {
            $resp = Invoke-WebRequest -Uri $Url -Method $Method -Headers $Headers -UseBasicParsing -ErrorAction Stop
        }
        $status = [int]$resp.StatusCode
        $content = $resp.Content
    } catch {
        $status = [int]$_.Exception.Response.StatusCode.value__
        $content = $_.ErrorDetails.Message
    }

    if ($status -eq $ExpectedStatus) {
        Write-Host "PASS [$status] $Name" -ForegroundColor Green
        $script:pass++
    } else {
        Write-Host "FAIL [$status, expected $ExpectedStatus] $Name" -ForegroundColor Red
        Write-Host "   $content" -ForegroundColor DarkGray
        $script:fail++
    }

    return $content
}

Write-Host "`n=== DeskFlow API Test Suite ===`n" -ForegroundColor Cyan

# 1. Health check
Invoke-Test -Name "Health check" -Method GET -Url "$baseUrl/api/health" -ExpectedStatus 200 | Out-Null

# 2. Login as Employee (and capture token)
$empLoginRaw = Invoke-Test -Name "Login as Employee" -Method POST -Url "$baseUrl/api/auth/login" -Body '{"email":"employee@deskflow.io","password":"password123"}' -ExpectedStatus 200
$empLogin = $empLoginRaw | ConvertFrom-Json
$empHeaders = @{ Authorization = "Bearer $($empLogin.token)" }

# 3. Login as Admin (and capture token)
$adminLoginRaw = Invoke-Test -Name "Login as Admin" -Method POST -Url "$baseUrl/api/auth/login" -Body '{"email":"admin@deskflow.io","password":"password123"}' -ExpectedStatus 200
$adminLogin = $adminLoginRaw | ConvertFrom-Json
$adminHeaders = @{ Authorization = "Bearer $($adminLogin.token)" }

# 4. Wrong password
Invoke-Test -Name "Login - wrong password (expect 401)" -Method POST -Url "$baseUrl/api/auth/login" -Body '{"email":"employee@deskflow.io","password":"wrongpassword"}' -ExpectedStatus 401 | Out-Null

# 5. Invalid/missing login fields
Invoke-Test -Name "Login - invalid email (expect 400)" -Method POST -Url "$baseUrl/api/auth/login" -Body '{"email":"not-an-email"}' -ExpectedStatus 400 | Out-Null

# 6. Create ticket as Employee (and capture its id)
$ticketRaw = Invoke-Test -Name "Create ticket (Employee)" -Method POST -Url "$baseUrl/api/tickets" -Body '{"title":"Laptop wont power on","description":"Held power button 30s, no lights, tried different outlet.","priority":"High"}' -Headers $empHeaders -ExpectedStatus 201
$ticket = $ticketRaw | ConvertFrom-Json
$ticketId = $ticket.data._id

# 7. Create ticket - invalid payload
Invoke-Test -Name "Create ticket - invalid payload (expect 400)" -Method POST -Url "$baseUrl/api/tickets" -Body '{"title":"x","description":"short","priority":"Urgent"}' -Headers $empHeaders -ExpectedStatus 400 | Out-Null

# 8. Create ticket as Admin - should be forbidden
Invoke-Test -Name "Create ticket as Admin (expect 403)" -Method POST -Url "$baseUrl/api/tickets" -Body '{"title":"Should fail","description":"Admins cannot create tickets per spec.","priority":"Low"}' -Headers $adminHeaders -ExpectedStatus 403 | Out-Null

# 9. Get tickets as Employee - own only
Invoke-Test -Name "Get tickets (Employee - own only)" -Method GET -Url "$baseUrl/api/tickets" -Headers $empHeaders -ExpectedStatus 200 | Out-Null

# 10. Get tickets as Admin - sees all
Invoke-Test -Name "Get tickets (Admin - all)" -Method GET -Url "$baseUrl/api/tickets" -Headers $adminHeaders -ExpectedStatus 200 | Out-Null

# 11. Get tickets - no token
Invoke-Test -Name "Get tickets - no token (expect 401)" -Method GET -Url "$baseUrl/api/tickets" -ExpectedStatus 401 | Out-Null

# 12. Update ticket status as Admin
Invoke-Test -Name "Update ticket status (Admin)" -Method PUT -Url "$baseUrl/api/tickets/$ticketId" -Body '{"status":"In Progress"}' -Headers $adminHeaders -ExpectedStatus 200 | Out-Null

# 13. Update ticket status as Employee - should be forbidden
Invoke-Test -Name "Update ticket status as Employee (expect 403)" -Method PUT -Url "$baseUrl/api/tickets/$ticketId" -Body '{"status":"Resolved"}' -Headers $empHeaders -ExpectedStatus 403 | Out-Null

# 14. Update ticket - invalid status enum value
Invoke-Test -Name "Update ticket - invalid status value (expect 400)" -Method PUT -Url "$baseUrl/api/tickets/$ticketId" -Body '{"status":"Cancelled"}' -Headers $adminHeaders -ExpectedStatus 400 | Out-Null

# 15. Update ticket - malformed MongoDB id
Invoke-Test -Name "Update ticket - invalid id format (expect 400)" -Method PUT -Url "$baseUrl/api/tickets/not-a-valid-id" -Body '{"status":"Resolved"}' -Headers $adminHeaders -ExpectedStatus 400 | Out-Null

# 16. Update ticket - well-formed but nonexistent id
Invoke-Test -Name "Update ticket - nonexistent id (expect 404)" -Method PUT -Url "$baseUrl/api/tickets/64a1f0c2e1b1c2a3d4e5f678" -Body '{"status":"Resolved"}' -Headers $adminHeaders -ExpectedStatus 404 | Out-Null

# 17. Completely unknown route
Invoke-Test -Name "Unknown route (expect 404)" -Method GET -Url "$baseUrl/api/nonsense" -ExpectedStatus 404 | Out-Null

# 18. Malformed JSON body
Invoke-Test -Name "Malformed JSON body (expect 400)" -Method POST -Url "$baseUrl/api/tickets" -Body '{ this is not valid json' -Headers $empHeaders -ExpectedStatus 400 | Out-Null

Write-Host "`n=== Results: $pass passed, $fail failed ===`n" -ForegroundColor Cyan
