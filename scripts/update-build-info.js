const fs = require('fs');
const path = require('path');

// Configuration
const VERSION_FILE_PATH = path.join(__dirname, '..', 'src', 'build-info.json');

// Get current date
const now = new Date();
const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
const formattedTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
const timestamp = now.getTime();

let currentBuildInfo = {
    version: "1.0.0",
    buildNumber: 0,
    buildDate: now.toDateString()
};

// Check if file exists and read current version
if (fs.existsSync(VERSION_FILE_PATH)) {
    try {
        const fileContent = fs.readFileSync(VERSION_FILE_PATH, 'utf8');
        currentBuildInfo = JSON.parse(fileContent);
    } catch (e) {
        console.warn("Could not read existing build info, starting fresh.");
    }
}

// Increment build number
currentBuildInfo.buildNumber += 1;
currentBuildInfo.buildDate = `${formattedDate} ${formattedTime}`;
currentBuildInfo.timestamp = timestamp;

// Write new build info
try {
    fs.writeFileSync(VERSION_FILE_PATH, JSON.stringify(currentBuildInfo, null, 2));
    console.log(`✅ Build info updated: Version ${currentBuildInfo.version} Build ${currentBuildInfo.buildNumber} (${currentBuildInfo.buildDate})`);
} catch (e) {
    console.error("❌ Failed to update build info:", e);
    process.exit(1);
}
