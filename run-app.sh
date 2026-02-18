#!/bin/zsh

# Define the project root
PROJECT_ROOT=$(pwd)
# Define the pattern to search for (Next.js binary in this project)
# We use the absolute path to avoid killing other Next.js projects
NEXT_BIN_PATTERN="$PROJECT_ROOT/node_modules/.bin/next"

echo "🔍 Checking for existing development instances..."

# 1. Kill by process name (Next.js specific to this project)
# pgrep -f searches the full command line
PIDS=$(pgrep -f "$NEXT_BIN_PATTERN")

if [ -n "$PIDS" ]; then
  echo "⚠️  Found running Next.js instances (PIDs: $(echo $PIDS | tr '\n' ' ')). Stopping them..."
  # Kill the processes
  echo "$PIDS" | xargs kill -9 > /dev/null 2>&1
  echo "✅  Stopped Next.js instances."
else
  echo "✅  No existing Next.js instances found for this project."
fi

# 2. Kill by port range (3000-3010) - extended range for standard dev ports
# This catches any other processes (like node servers) running on these ports
for PORT in {3000..3010}; do
  PID=$(lsof -ti:$PORT)
  if [ -n "$PID" ]; then
    echo "⚠️  Found process $PID running on port $PORT. Killing it..."
    kill -9 $PID > /dev/null 2>&1
    echo "✅  Process on port $PORT killed."
  fi
done

# Clean cache and artifacts
echo "🧹 Cleaning cache and artifacts..."
rm -rf .next
rm -rf node_modules/.cache
echo "✅  Cache cleaned."

echo "🚀 Starting Suksan Massage App..."
echo "📝 Logging will be displayed in this console."
echo "🌍 App should be available at http://localhost:3000"
echo ""

# Run the development server
npm run dev
