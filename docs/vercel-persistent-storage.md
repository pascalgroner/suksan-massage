# Vercel Persistent Storage & Knowledge Base

## Issue: Read-Only Filesystem (EROFS)

When deploying Next.js applications to Vercel (or similar serverless environments), you may encounter the following error when trying to write to local files:

```
Error: EROFS: read-only file system, open '/var/task/src/resources/counter.json'
```

### Explanation

Vercel's serverless functions run in ephemeral, read-only containers. You cannot write files to the filesystem (`fs.writeFileSync`) and expect them to persist or even be written at all.

- **Runtime**: The filesystem is read-only (except for `/tmp`, which is non-persistent and cleared between invocations).
- **Persistence**: Any data written to local variables or `/tmp` is lost when the function spins down.

### Solution: External Data Store (Redis)

To store updatable data persistently (like a daily submission counter), you must use an external database. **Redis** (specifically Upstash Redis via Vercel Integrations) is the recommended standard.

#### 1. Setup Vercel KV (Redis)

1.  Go to your Vercel Project Dashboard.
2.  Navigate to **Storage**.
3.  Click **Create Database** -> **Redis** (Upstash).
4.  Link it to your project. This sets `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables automatically.

#### 2. Implementation with `@upstash/redis`

**Install:**

```bash
npm install @upstash/redis
```

**Code Pattern:**

```typescript
import { Redis } from "@upstash/redis";

// robust initialization with fallback
let redis: Redis | null = null;
try {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    redis = Redis.fromEnv();
  }
} catch (e) {
  console.warn("Redis not configured");
}

// usage
if (redis) {
  await redis.incr("my-counter");
}
```

### Environment Variables

Ensure these are present in `.env` (local) and Vercel Environment Variables (production):

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

To pull production envs locally:

```bash
vercel env pull .env
```

---

## SMTP & Email Reliability

When sending emails from serverless functions using `nodemailer`:

1.  **Await Sending**: Always `await transporter.sendMail(...)`. If you don't await, the function execution might freeze/terminate before the network request completes.
2.  **Error Handling**: Wrap in `try/catch`.
3.  **Validation**: Check `info.accepted` or `info.rejected` if strictly necessary, though `nodemailer` usually throws on SMTP rejection.

### "Fail-Safe" Pattern

If a non-critical action (like sending a "Thank you" email to the customer) fails, catch/log the error but **do not fail the main request**.
If the critical action (sending the order to the shop owner) fails, **throw an error** and return a 500 status so the UI can inform the user.
