#!/bin/sh

# Toujours vérifier et reconstruire sqlite3 si nécessaire
echo "Checking sqlite3..."
if ! node -e "require('sqlite3')" 2>/dev/null; then
  echo "sqlite3 not working, rebuilding..."
  npm rebuild sqlite3
fi

# Lancer la commande passée en argument (npm run start)
exec "$@"
