# 1. Aseguramos estar en develop y actualizados
git checkout develop
git pull origin develop

# 2. Eliminar ramas locales obsoletas
$localBranches = @("ev2/jonathanGuillen", "jonathanGuillen")
foreach ($branch in $localBranches) {
    Write-Host "Eliminando rama local: $branch"
    git branch -D $branch 2>$null
}

# 3. Eliminar ramas remotas obsoletas
$remoteBranches = @(
    "ev1/ale-corva", "ev1/daniela-salvo", "ev1/gerardo-romero", "ev1/gonzalo-velasco", "ev1/jonathanGuillen",
    "ev2/ale-corva", "ev2/daniela-salvo", "ev2/gerardo-romero", "ev2/gonzalo-velasco", "ev2/jonathanGuillen",
    "jonathanGuillen"
)
foreach ($branch in $remoteBranches) {
    Write-Host "Eliminando rama remota: $branch"
    git push origin --delete $branch 2>$null
}

# 4. Limpiar referencias remotas locales
git fetch --prune

# 5. Crear las nuevas ramas de features (Sprint 2) basadas en las issues agrupadas
$features = @("feature/issue-39", "feature/issue-40", "feature/issue-41", "feature/issue-42", "feature/issue-43")

foreach ($feature in $features) {
    Write-Host "Creando rama: $feature"
    git checkout -b $feature develop
    git push -u origin $feature
}

# 6. Volver a develop al final
git checkout develop
Write-Host "=== LIMPIEZA COMPLETADA ==="
