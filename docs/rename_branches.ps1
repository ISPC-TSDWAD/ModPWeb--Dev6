# Diccionario de renombre de ramas
$branchMappings = @{
    "feature/issue-39" = "feature/issue-39-backend-jwt"
    "feature/issue-40" = "feature/issue-40-frontend-api"
    "feature/issue-41" = "feature/issue-41-qa-forms"
    "feature/issue-42" = "feature/issue-42-docs-diagrams"
    "feature/issue-43" = "feature/issue-43-wiki-release"
}

# Nos aseguramos de estar en develop
git checkout develop

foreach ($oldName in $branchMappings.Keys) {
    $newName = $branchMappings[$oldName]
    Write-Host "Renombrando $oldName a $newName ..."
    
    # Eliminar la rama remota vieja
    git push origin --delete $oldName 2>$null
    
    # Renombrar localmente
    git branch -m $oldName $newName 2>$null
    
    # Subir la nueva rama remota y setear tracking
    git push -u origin $newName
}

Write-Host "=== RENOMBRAMIENTO COMPLETADO ==="
