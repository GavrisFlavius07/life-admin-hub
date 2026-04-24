Param()
$ErrorActionPreference = 'Stop'

Write-Host '== Life Admin Hub: Dev setup script =='

Write-Host 'Installing npm dependencies...'
npm install

$envFile = '.env.local'
if (-Not (Test-Path $envFile)) {
  Write-Host "Creating $envFile with a random JWT_SECRET..."
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  $bytes = New-Object byte[] 48
  $rng.GetBytes($bytes)
  $secret = [System.Convert]::ToBase64String($bytes)
  $content = 'JWT_SECRET="' + $secret + '"'
  Set-Content -Path $envFile -Value $content -Encoding utf8
  Write-Host "$envFile created. Edit it if you want a different secret."
} else {
  Write-Host "$envFile already exists - make sure it contains a JWT_SECRET entry."
}

Write-Host 'Generating Prisma client...'
npx prisma generate

Write-Host 'Applying Prisma migrations (dev)...'
npx prisma migrate dev --name init

Write-Host 'Starting Next.js dev server...'
npm run dev
