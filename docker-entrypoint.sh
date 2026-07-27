#!/bin/sh
set -e

if [ -f .env ]; then
  echo "Using .env"
fi

# Keep NODE_ENV as development for next dev (production React has no jsxDEV).
export NODE_ENV=development

if [ -d ./prisma ]; then
  echo "Generating Prisma client"
  if [ -x ./node_modules/.bin/prisma ]; then
    ./node_modules/.bin/prisma generate || true
    echo "Running prisma migrate deploy (if migrations exist)"
    ./node_modules/.bin/prisma migrate deploy || true
  else
    echo "Prisma CLI not found, skipping."
  fi
fi

echo "Starting Next.js development server"
exec npx next dev -H 0.0.0.0 -p 3000
