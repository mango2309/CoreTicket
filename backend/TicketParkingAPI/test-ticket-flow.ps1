# Configuración
$baseUrl = "http://localhost:5000/api/TicketQuery"
$lealtadUrl = "http://localhost:5000/api/Lealtad"
$ticketCode = "TICKET001"
$userId = 1

Write-Host "1. Creando nuevo ticket..." -ForegroundColor Green
$createResponse = Invoke-RestMethod -Uri $baseUrl -Method Post -ContentType "application/json" -Body "{\"ticketCode\":\"$ticketCode\",\"idUsuario\":$userId}"
Write-Host "Ticket creado con ID: $($createResponse.idTicket)"
Write-Host "Estado inicial: $($createResponse.estadoTicket)"
Write-Host ""

Write-Host "2. Consultando ticket recién creado..." -ForegroundColor Green
$ticketResponse = Invoke-RestMethod -Uri "$baseUrl/code/$ticketCode" -Method Get
Write-Host "Estado: $($ticketResponse.estadoTicket)"
Write-Host "Horas transcurridas: $($ticketResponse.tiempoEstadia)"
Write-Host "Puntos de lealtad: $($ticketResponse.puntosLealtad)"
Write-Host ""

Write-Host "Esperando 2 minutos para simular tiempo de estacionamiento..." -ForegroundColor Yellow
Start-Sleep -Seconds 120

Write-Host "3. Consultando ticket después de 2 minutos..." -ForegroundColor Green
$ticketResponse = Invoke-RestMethod -Uri "$baseUrl/code/$ticketCode" -Method Get
Write-Host "Estado: $($ticketResponse.estadoTicket)"
Write-Host "Horas transcurridas: $($ticketResponse.tiempoEstadia)"
Write-Host "Puntos de lealtad: $($ticketResponse.puntosLealtad)"
Write-Host ""

Write-Host "4. Pagando el ticket..." -ForegroundColor Green
$payResponse = Invoke-RestMethod -Uri "$baseUrl/$($ticketResponse.idTicket)/pagar" -Method Put
Write-Host "Estado después de pago: $($payResponse.estadoTicket)"
Write-Host "Horas finales: $($payResponse.tiempoEstadia)"
Write-Host "Puntos de lealtad finales: $($payResponse.puntosLealtad)"
Write-Host ""

Write-Host "5. Actualizando puntos de lealtad..." -ForegroundColor Green
$lealtadDto = @{
    usuarioId = $userId
    puntosAcumulados = $payResponse.puntosLealtad
    horasAcumuladas = $payResponse.tiempoEstadia
} | ConvertTo-Json

Invoke-RestMethod -Uri "$lealtadUrl/agregar-puntos" -Method Post -ContentType "application/json" -Body $lealtadDto
Write-Host "Puntos de lealtad actualizados en el sistema"
Write-Host ""

Write-Host "6. Consultando puntos de lealtad del usuario..." -ForegroundColor Green
$lealtadResponse = Invoke-RestMethod -Uri "$lealtadUrl/usuario/$userId" -Method Get
Write-Host "Puntos acumulados totales: $($lealtadResponse.puntosAcumulados)"
Write-Host "Horas acumuladas totales: $($lealtadResponse.horasAcumuladas)"
Write-Host "Última actualización: $($lealtadResponse.ultimaActualizacion)"
Write-Host ""

Write-Host "7. Consultando ticket pagado..." -ForegroundColor Green
$finalResponse = Invoke-RestMethod -Uri "$baseUrl/code/$ticketCode" -Method Get
Write-Host "Estado final: $($finalResponse.estadoTicket)"
Write-Host "Horas finales: $($finalResponse.tiempoEstadia)"
Write-Host "Puntos de lealtad finales: $($finalResponse.puntosLealtad)" 