@echo off
echo ========================================
echo   VERIFICATION PRE-DEPLOIEMENT
echo   CommissionHub - SBCS
echo ========================================
echo.

echo [1/5] Verification des fichiers .env...
if exist .env (
    echo    ✓ Fichier .env trouve
) else (
    echo    ✗ ERREUR: Fichier .env manquant
    echo    Creez un fichier .env avec vos variables Supabase
    pause
    exit /b 1
)
echo.

echo [2/5] Verification des dependances...
if exist node_modules (
    echo    ✓ node_modules existe
) else (
    echo    ✗ Installation des dependances...
    call npm install
)
echo.

echo [3/5] Test de compilation...
call npm run build > build.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    ✓ Compilation reussie
    del build.log
) else (
    echo    ✗ ERREUR de compilation
    echo    Consultez build.log pour plus de details
    pause
    exit /b 1
)
echo.

echo [4/5] Verification Git...
git status > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    ✓ Repository Git initialise
    git remote -v | findstr "origin" > nul
    if %ERRORLEVEL% EQU 0 (
        echo    ✓ Remote GitHub configure
    ) else (
        echo    ✗ Remote GitHub non configure
    )
) else (
    echo    ✗ Git non initialise
)
echo.

echo [5/5] Verification des fichiers critiques...
set "files_ok=1"
if exist "src\app\page.tsx" (echo    ✓ page.tsx) else (set "files_ok=0" & echo    ✗ page.tsx manquant)
if exist "src\app\layout.tsx" (echo    ✓ layout.tsx) else (set "files_ok=0" & echo    ✗ layout.tsx manquant)
if exist "src\app\dashboard\page.tsx" (echo    ✓ dashboard/page.tsx) else (set "files_ok=0" & echo    ✗ dashboard/page.tsx manquant)
if exist "src\lib\supabase\client.tsx" (echo    ✓ supabase/client.tsx) else (set "files_ok=0" & echo    ✗ supabase/client.tsx manquant)
if exist "package.json" (echo    ✓ package.json) else (set "files_ok=0" & echo    ✗ package.json manquant)
if exist "next.config.mjs" (echo    ✓ next.config.mjs) else (set "files_ok=0" & echo    ✗ next.config.mjs manquant)
echo.

if "%files_ok%"=="0" (
    echo ✗ ERREUR: Fichiers critiques manquants
    pause
    exit /b 1
)

echo ========================================
echo   ✓ VERIFICATION TERMINEE
echo   Votre projet est pret pour le deploiement!
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Allez sur https://vercel.com
echo 2. Connectez-vous avec GitHub
echo 3. Importez le projet "commissionhub"
echo 4. Ajoutez les variables d'environnement
echo 5. Cliquez sur Deploy
echo.
echo Consultez GUIDE_DEPLOIEMENT_FINAL.md pour plus de details
echo.
pause
