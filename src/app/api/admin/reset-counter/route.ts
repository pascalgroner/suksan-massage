import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
    try {
        // Path to the counter file
        // Note: For persistence to work on Netlify this must be hooked into their Blob storage or similar,
        // but for now we follow the user's filesystem-based approach which assumes persistent disk or specific runtime behavior.
        const file = path.join(process.cwd(), 'src', 'resources', 'counter.json');
        
        // Reset count to 0, keep today's date or just reset
        const data = {
            date: new Date().toISOString().split('T')[0],
            count: 0
        };
        
        fs.writeFileSync(file, JSON.stringify(data));
        
        return NextResponse.json({ success: true, message: "Counter reset successfully" });
    } catch (e) {
        return NextResponse.json({ error: "Failed to reset counter" }, { status: 500 });
    }
}
