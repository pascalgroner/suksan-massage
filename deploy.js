const fs = require('fs');
const { execSync, spawnSync } = require('child_process');
const readline = require('readline');
const path = require('path');
const dns = require('dns');

// Configuration
const DOMAIN = "suksan-massage.com"; // Default domain, can be updated or read from args
const ENV_FILE = '.env';

// Colors for console output
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m"
};

const log = (msg, color = colors.reset) => console.log(`${color}${msg}${colors.reset}`);
const error = (msg) => console.error(`${colors.red}❌ ${msg}${colors.reset}`);

// Helper to execute shell commands
const run = (command, options = {}) => {
    try {
        return execSync(command, { encoding: 'utf8', stdio: 'pipe', ...options }).trim();
    } catch (e) {
        return null; // Return null on failure
    }
};

// Helper for interactive input
const ask = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(`${colors.yellow}${question} ${colors.reset}`, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

// Main Deployment Logic
async function deploy() {
    log("\n🚀 Starting Smart Deployment Script...\n", colors.bright);

    // 1. Dependency Check
    log("🔍 Checking dependencies...", colors.cyan);
    if (!run('command -v netlify')) {
        error("Netlify CLI is not installed.");
        const install = await ask("Do you want to install it globally now? (y/n)");
        if (install.toLowerCase() === 'y') {
            try {
                execSync('npm install -g netlify-cli', { stdio: 'inherit' });
            } catch (e) {
                error("Failed to install Netlify CLI. Please install manually.");
                process.exit(1);
            }
        } else {
            process.exit(1);
        }
    }

    // 2. DNS Validation
    log(`\n🌍 Validating DNS for ${DOMAIN}...`, colors.cyan);
    try {
        await new Promise((resolve, reject) => {
            dns.resolve(DOMAIN, (err, addresses) => {
                if (err || !addresses || addresses.length === 0) {
                    log(`⚠️  Warning: Could not resolve DNS for ${DOMAIN}. It might not be propagated yet.`, colors.yellow);
                    // reject(err); // Don't block deployment on DNS check, just warn
                    resolve(); 
                } else {
                    log(`✅ DNS Resolved: ${addresses.join(', ')}`, colors.green);
                    resolve();
                }
            });
        });
    } catch (e) {
        // Ignored
    }

    // 3. Environment Variable Sync
    log("\n🔐 Checking Environment Variables...", colors.cyan);
    
    // Read local .env
    const localEnvContent = fs.readFileSync(path.resolve(process.cwd(), ENV_FILE), 'utf8');
    const localEnvs = {};
    localEnvContent.split('\n').forEach(line => {
        // Strip comments first
        const lineWithoutComments = line.split('#')[0].trim();
        const match = lineWithoutComments.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const val = match[2].trim().replace(/^['"]|['"]$/g, ''); // Simple cleanup
            localEnvs[key] = val;
        }
    });

    // Get Remote Envs
    log("   Fetching remote variables from Netlify...", colors.reset);
    // netlify env:list --json might fail if not linked. Check link status first.
    if (!fs.existsSync('.netlify/state.json')) {
        log("   Project not linked. running 'netlify link'...", colors.yellow);
        try {
            execSync('netlify link', { stdio: 'inherit' });
        } catch (e) {
            error("Failed to link project.");
            process.exit(1);
        }
    }

    let remoteEnvs = {};
    try {
        const remoteOutput = run('netlify env:list --json');
        if (remoteOutput) {
            remoteEnvs = JSON.parse(remoteOutput);
        }
    } catch (e) {
        log("   Could not fetch remote envs (JSON format might not be supported by installed CLI version). Skipping automatch.", colors.yellow);
    }

    // Compare and Prompt
    const missingKeys = Object.keys(localEnvs).filter(key => !remoteEnvs[key]);
    
    if (missingKeys.length > 0) {
        log(`\n⚠️  The following variables are defined locally but missing in Netlify:`, colors.yellow);
        missingKeys.forEach(k => log(`   - ${k}`, colors.yellow));
        
        const shouldSync = await ask("\nDo you want to upload these to Netlify now? (y/n)");
        if (shouldSync.toLowerCase() === 'y') {
            for (const key of missingKeys) {
                const val = localEnvs[key];
                log(`   Setting ${key}...`, colors.reset);
                try {
                    // netlify env:set KEY "VAL"
                    execSync(`netlify env:set ${key} "${val}"`, { stdio: 'inherit' });
                } catch (e) {
                    error(`Failed to set ${key}`);
                }
            }
            log("✅ Environment variables updated.", colors.green);
        }
    } else {
        log("✅ All local environment variables are present in Netlify.", colors.green);
    }

    // 4. Deploy
    log("\n🚀 Deploying to Production...", colors.cyan);
    try {
        // Using spawn to keep color output and interactivity
        const deployProc = spawnSync('netlify', ['deploy', '--build', '--prod'], { stdio: 'inherit' });
        if (deployProc.status === 0) {
            log("\n✅ Deployment Successful!", colors.green);
        } else {
            error("Deployment failed.");
            process.exit(1);
        }
    } catch (e) {
        error("Deployment failed.");
        process.exit(1);
    }
}

deploy();
