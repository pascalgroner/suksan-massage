#!/bin/bash

# Suksan Massage - Automated Netlify Deployment Script
# This script handles the installation of the CLI, login, site creation, and deployment.

echo "🚀 Starting Automated Deployment to Netlify..."

# 1. Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# 2. Install Netlify CLI
echo "📦 Installing Netlify CLI..."
npm install -g netlify-cli || echo "⚠️  Could not install globally. Trying local npx..."

# 3. Login to Netlify
echo "🔑 Logging in to Netlify..."
echo "👉 A browser window will open. Please log in and authorize Netlify CLI."
netlify login
if [ $? -ne 0 ]; then
    echo "❌ Login failed. Please try again."
    exit 1
fi
echo "✅ Logged in successfully."

# 4. Initialize Site
# We use --manual to avoid complex Git integration in this script, 
# although Git integration is recommended for production.
# This creates a site and links it to the current folder.
echo "🛠  Initializing site..."
if [ ! -f ".netlify/state.json" ]; then
    echo "👉 Please choose 'Create & configure a new site' and follow the prompts."
    netlify init --manual
else
    echo "✅ Site already initialized."
fi

# 5. Build and Deploy
echo "🏗  Building and Deploying to Production..."
# We use --prod to deploy directly to the main URL.
# Netlify CLI will detect Next.js and build it correctly.
netlify deploy --build --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment Successful!"
else
    echo "❌ Deployment Failed."
    exit 1
fi

# 6. Domain Setup Instructions
echo ""
echo "🎉 ---------------------------------------------------"
echo "🌐 YOUR SITE IS LIVE!"
echo "---------------------------------------------------"
echo ""
echo "👉 To set up your custom domain (suksan-massage.ch):"
echo "   1. Run: netlify sites:list (to see your site name)"
echo "   2. Run: netlify domain:add suksan-massage.ch"
echo "   3. Log in to Namecheap and update your Nameservers to the ones shown."
echo ""
echo "Congratulations! Your massage website is online."
