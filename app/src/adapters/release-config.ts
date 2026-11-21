import { loadCanonicalConfig } from './config-repository';
import { adminStore } from './admin-store';
import { setupConfig } from '../application/assessment-setup';
import { ConfigLoadError } from './config-repository';
import { z } from 'zod';
import { quickEligibility } from '../application/admin/quick-wording';
// Only an immutable server-held release is selected; request bodies never supply config.
export function releaseConfig(sessionVersion?: string) {
    if (process.env.MOSAIC_ADMIN_ENABLED !== '1')
        return loadCanonicalConfig();
    const suffix = '/' + setupConfig.version;
    if (sessionVersion && !sessionVersion.endsWith(suffix))
        throw new ConfigLoadError('Unknown assessment version');
    const release = adminStore().release(sessionVersion?.slice(0, -suffix.length));
    return { config: release.config, diagnostics: [] as string[], quickEligibility: quickEligibility(release) };
}
export function releaseConfigForInput(input: unknown) {
    const { configVersion } = z.object({ configVersion: z.string().min(1) }).parse(input);
    return releaseConfig(configVersion);
}
