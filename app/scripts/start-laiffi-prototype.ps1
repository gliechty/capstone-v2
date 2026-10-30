# Local prototype only. The key is read without echo and never saved to disk.
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
$secret = Read-Host 'Enter Laiffi key (hidden; press Enter)' -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
  $env:LAIFFI_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  $env:LAIFFI_PROTOTYPE_ENABLED = '1'
  Remove-Item Env:CAPSTONE_OFFLINE_TESTS -ErrorAction SilentlyContinue
  Write-Host 'Local prototype: http://127.0.0.1:3002/guided-electricity'
  Write-Host 'No evaluations run automatically. Keep this window open; Ctrl+C stops the server.'
  & node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3002
} finally {
  Remove-Item Env:LAIFFI_API_KEY -ErrorAction SilentlyContinue
  Remove-Item Env:LAIFFI_PROTOTYPE_ENABLED -ErrorAction SilentlyContinue
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
  $secret.Dispose()
}
