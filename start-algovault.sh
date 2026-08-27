#!/usr/bin/env bash
set -e

echo "==================================================="
echo "  🚀 Starting AlgoVault Docker Infrastructure...  "
echo "==================================================="
echo ""

if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed or not in PATH."
    echo "Please install Docker Desktop and make sure it is open."
    exit 1
fi

echo "[1/2] Building and launching PostgreSQL, Redis, and Spring Boot Backend..."
docker compose up -d --build

echo ""
echo "==================================================="
echo "  ✅ SUCCESS! AlgoVault is live on http://localhost:8080"
echo "==================================================="
echo ""
echo "Next steps:"
echo "1. Open Google Chrome and go to chrome://extensions"
echo "2. Enable 'Developer mode' (top-right corner switch)"
echo "3. Click 'Load unpacked' and select:"
echo "   $(pwd)/extension/build/chrome-mv3-prod"
echo ""
