#!/bin/zsh

# Port configuration
PORT=3000

echo "🔍 Checking for existing instances on port $PORT..."

# Check if port is in use and kill the process
PID=$(lsof -ti:$PORT)
if [ -n "$PID" ]; then
  echo "⚠️  Found process $PID running on port $PORT. Killing it..."
  kill -9 $PID
  echo "✅  Process killed."
else
  echo "✅  No existing instances found on port $PORT."
fi

# Clean cache and artifacts
echo "🧹 Cleaning cache and artifacts..."
rm -rf .next
rm -rf node_modules/.cache
echo "✅  Cache cleaned."

echo "🚀 Starting Suksan Massage App..."
echo "📝 Logging will be displayed in this console."
echo "🌍 App should be available at http://localhost:$PORT"
echo ""

# Run the development server
npm run dev
