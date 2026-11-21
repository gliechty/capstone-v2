import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { hash } from './admin-store';
import { AdminError } from '../application/admin/contracts';
// Archives are runtime read-only files, explicitly packaged separately from private storage.
const roots = () => [path.resolve(process.cwd(), '..', 'BUILD_PACK', '04_CONFIG', 'raw', 'atomic_indicators'), path.resolve(process.cwd(), 'config', 'capstone-original')];
export function archivedArtifacts() { return roots().flatMap(root => existsSync(/* turbopackIgnore: true */ root) ? readdirSync(/* turbopackIgnore: true */ root).filter(name => /\.(csv|json)$/.test(name)).map(name => ({ id: hash(root + '/' + name), name, sha256: hash(readFileSync(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ root, name))), origin: 'Archived original; generation not executed here' })) : []); }
export function readArchive(id: string) { for (const root of roots()) {
    if (!existsSync(/* turbopackIgnore: true */ root))
        continue;
    for (const name of readdirSync(/* turbopackIgnore: true */ root))
        if (/\.(csv|json)$/.test(name) && hash(root + '/' + name) === id)
            return { name, bytes: readFileSync(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ root, name), 'utf8') };
} throw new AdminError('Archive unavailable', 404); }
