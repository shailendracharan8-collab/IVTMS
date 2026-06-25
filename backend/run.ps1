#Requires -Version 5.1
<#
Starts the IVTMS backend on http://localhost:8081 (see application.yml).
- Sets JAVA_HOME from the JDK behind java.exe on PATH (required for Maven on Windows).
- Downloads Apache Maven to %TEMP% if mvn is not on PATH.
Requires: MySQL on localhost:3306 with database ivtms_db.
Uses DB_USERNAME / DB_PASSWORD env vars; if unset or still the yml placeholders, defaults to root with an empty password (override if your MySQL uses a different account).
#>
# MySQL credentials (see application.yml). Override placeholders from machine-wide env if present.
if (-not $env:DB_USERNAME -or $env:DB_USERNAME -eq "your_db_user") { $env:DB_USERNAME = "Sarvesh" }
if (-not $env:DB_PASSWORD -or $env:DB_PASSWORD -eq "your_db_password") { $env:DB_PASSWORD = "Sarvesh@1409" }

$ErrorActionPreference = "Stop"
$backendRoot = $PSScriptRoot

# Avoid stale overrides from earlier shells (e.g. H2 experiments) so application.yml drives the datasource
foreach ($k in @(
        "SPRING_DATASOURCE_URL",
        "SPRING_DATASOURCE_DRIVER_CLASS_NAME",
        "SPRING_DATASOURCE_USERNAME",
        "SPRING_DATASOURCE_PASSWORD",
        "SPRING_JPA_DATABASE_PLATFORM"
    )) {
    if (Test-Path "Env:$k") { Remove-Item "Env:$k" }
}

# java prints build info to stderr; merge streams so PowerShell does not treat it as a terminating error
$javaHomeLine = (cmd /c "java -XshowSettings:properties -version 2>&1" | Select-String "java\.home\s*=\s*(.+)" | Select-Object -First 1).Line
if (-not $javaHomeLine) { Write-Error "Java not found on PATH. Install JDK 17+ and retry." }
$env:JAVA_HOME = ($javaHomeLine -replace ".*=\s*", "").Trim()
if (-not (Test-Path (Join-Path $env:JAVA_HOME "bin\java.exe"))) {
    Write-Error "Invalid JAVA_HOME: $($env:JAVA_HOME)"
}
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

$mvnExe = $null
$cmd = Get-Command mvn -ErrorAction SilentlyContinue
if ($cmd) { $mvnExe = $cmd.Source }
else {
    $mavenVer = "3.9.15"
    $mavenHome = Join-Path $env:TEMP "apache-maven-$mavenVer"
    $mvnExe = Join-Path $mavenHome "bin\mvn.cmd"
    if (-not (Test-Path $mvnExe)) {
        $zip = Join-Path $env:TEMP "apache-maven-$mavenVer-bin.zip"
        Write-Host "Downloading Maven $mavenVer ..."
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri "https://dlcdn.apache.org/maven/maven-3/$mavenVer/binaries/apache-maven-$mavenVer-bin.zip" -OutFile $zip -UseBasicParsing
        Expand-Archive -Path $zip -DestinationPath $env:TEMP -Force
    }
}

$dbListen = @(Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue | Where-Object { $_.State -eq "Listen" })
if ($dbListen.Count -eq 0) {
    Write-Warning "No listener on port 3306. Start MySQL, create database ivtms_db, then set DB_USERNAME and DB_PASSWORD (env vars) to match."
}

Write-Host "Using MySQL user '$($env:DB_USERNAME)' (set DB_USERNAME / DB_PASSWORD in this window if login fails)."

Write-Host "Starting Spring Boot: $backendRoot -> http://localhost:8081"
Set-Location $backendRoot
& $mvnExe -f (Join-Path $backendRoot "pom.xml") -DskipTests spring-boot:run
