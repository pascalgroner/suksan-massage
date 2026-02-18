const fs = require('fs');
const { execSync, spawnSync } = require('child_process');
const readline = require('readline');
const path = require('path');
const dns = require('dns');

// Configuration
const DOMAIN = "suksan-massage.com"; // Default domain, can be updated or read from args

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
    log("\n🚀 Starting Smart Deployment Script (Vercel)...\n", colors.bright);

    // 1. Dependency Check
    log("🔍 Checking dependencies...", colors.cyan);
    if (!run('command -v vercel')) {
        error("Vercel CLI is not installed.");
        const install = await ask("Do you want to install it globally now? (y/n)");
        if (install.toLowerCase() === 'y') {
            try {
                execSync('npm install -g vercel', { stdio: 'inherit' });
            } catch (e) {
                error("Failed to install Vercel CLI. Please install manually.");
                process.exit(1);
            }
        } else {
            console.log("Please install Vercel CLI manually: npm install -g vercel");
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
    
    let envFilePath = path.resolve(process.cwd(), '.env.production');
    if (!fs.existsSync(envFilePath)) {
        log("   No .env.production found. Falling back to .env", colors.yellow);
        envFilePath = path.resolve(process.cwd(), '.env');
    } else {
        log("   Using .env.production for deployment.", colors.green);
    }

    if (!fs.existsSync(envFilePath)) {
        error("   No environment file found (.env or .env.production). Skipping sync.");
    } else {
        // Read local env
        const localEnvContent = fs.readFileSync(envFilePath, 'utf8');
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
        log("   Fetching remote variables from Vercel...", colors.reset);

        // Check link status first.
        // Vercel stores project config in .vercel/project.json usually
        if (!fs.existsSync('.vercel/project.json')) {
            log("   Project not linked. running 'vercel link'...", colors.yellow);
            try {
                execSync('vercel link', { stdio: 'inherit' });
            } catch (e) {
                error("Failed to link project.");
                process.exit(1);
            }
        }

        let remoteKeys = [];
        try {
            // vercel env ls production returns a formatted table. We need to parse it.
            // Example output:
            //   name      value   production   preview   development   created
            //   API_KEY   *****   ✔            ✔         ✔             1d ago
            const remoteOutput = run('vercel env ls production');
            if (remoteOutput) {
                const lines = remoteOutput.split('\n');
                // Skip header (usually first 2 lines or so, depends on version)
                // We'll iterate and look for lines starting with valid keys
                // A better way is to rely on column spacing, but that's brittle.
                // Or maybe just grab the first word of each line if it looks like a KEY
                
                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length > 0) {
                        const key = parts[0];
                        // Allow all valid env chars, exclude header common words
                        if (key && !['name', 'value', 'created', 'updated', 'encrypted'].includes(key.toLowerCase()) && key.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
                            remoteKeys.push(key);
                        }
                    }
                });
            }
        } catch (e) {
            log("   Could not fetch remote envs. Skipping sync check.", colors.yellow);
        }

        // Compare and Prompt
        // We look for keys in local that are NOT in remoteKeys
        const missingKeys = Object.keys(localEnvs).filter(key => !remoteKeys.includes(key));
        
        if (missingKeys.length > 0) {
            log(`\n⚠️  The following variables are missing in Vercel (Production):`, colors.yellow);
            missingKeys.forEach(k => log(`   - ${k}`, colors.yellow));
            
            const shouldSync = await ask("\nDo you want to add these to Vercel now? (y/n)");
            if (shouldSync.toLowerCase() === 'y') {
                for (const key of missingKeys) {
                    const val = localEnvs[key];
                    log(`   Adding ${key}...`, colors.reset);
                    try {
                        // usage: echo -n val | vercel env add KEY production
                        // Note: handling quotes or special chars in val might be tricky with echo
                        // Better to use spawn and stdin
                        const child = spawnSync('vercel', ['env', 'add', key, 'production'], {
                            input: val,
                            stdio: ['pipe', 'inherit', 'inherit'],
                            encoding: 'utf-8'
                        });
                        
                        if (child.status !== 0) {
                             error(`Failed to add ${key}`);
                        }
                    } catch (e) {
                        error(`Failed to add ${key}`);
                    }
                }
                log("✅ Environment variables updated.", colors.green);
            }
        } else {
            log("✅ All local environment variables exist in Vercel configuration.", colors.green);
        }
    }

    // 4. Deploy
    log("\n🚀 Deploying to Production...", colors.cyan);
    try {
        // Using spawn to keep color output and interactivity
        // vercel --prod triggers a production deployment
        const deployProc = spawnSync('vercel', ['--prod'], { stdio: 'inherit' });
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
