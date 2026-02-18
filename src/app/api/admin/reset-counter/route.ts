import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client if environment variables are available
let redis: Redis | null = null;
try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        redis = Redis.fromEnv();
    }
} catch (e) {
    console.warn("Redis configuration missing or invalid.");
}

export async function POST() {
    try {
        if (!redis) {
             return NextResponse.json({ success: true, message: "Counter reset (Simulated - Redis not configured)" });
        }

        const today = new Date().toISOString().split('T')[0];
        const key = `contact-form:daily-count:${today}`;
        
        // Reset count by deleting the key
        await redis.del(key);
        
        return NextResponse.json({ success: true, message: "Counter reset successfully" });
    } catch (e) {
        console.error("Failed to reset counter", e);
        return NextResponse.json({ error: "Failed to reset counter" }, { status: 500 });
    }
}
