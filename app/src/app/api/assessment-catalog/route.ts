import { releaseConfig } from '../../../adapters/release-config';
import { assessmentCatalog } from '../../../application/assessment-catalog';
export const runtime = 'nodejs';
export async function GET(request: Request) { try {
    const version = new URL(request.url).searchParams.get('version') ?? undefined;
    if (version && version.length > 200)
        return Response.json({ error: 'Invalid version' }, { status: 400 });
    const { config } = releaseConfig(version);
    return Response.json(assessmentCatalog(config), { headers: { 'Cache-Control': 'no-store' } });
}
catch {
    return Response.json({ error: 'The saved assessment release is unavailable. Your saved answers have not been changed.' }, { status: 503 });
} }
