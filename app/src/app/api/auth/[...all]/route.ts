import { getAuth } from "../../../../adapters/admin-auth";
export const runtime = 'nodejs';
async function handle(request: Request) { try {
    return await (await getAuth()).handler(request);
}
catch {
    return Response.json({ error: 'Google authentication is not configured or is unavailable.' }, { status: 503 });
} }
export const GET = handle;
export const POST = handle;
