import "server-only";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { existsSync } from "node:fs";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { APIError } from "better-auth/api";
import { getMigrations } from "better-auth/db/migration";
import { adminStore, adminDataPath } from "./admin-store";
import { AdminError, type Actor } from "../application/admin/contracts";
export const adminEnabled = () => process.env.MOSAIC_ADMIN_ENABLED === '1';
export const adminURL = () => process.env.BETTER_AUTH_URL || 'http://localhost:3206';
export const oauthReady = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.BETTER_AUTH_SECRET && process.env.MOSAIC_SUPER_ADMIN_EMAIL);
export function developmentIdentityAllowed(url: string) { const u = new URL(url); return adminEnabled() && process.env.NODE_ENV === 'development' && process.env.MOSAIC_DEV_IDENTITY === '1' && ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname) && u.origin === new URL(adminURL()).origin; }
export function sameOrigin(request: Request) { if (request.headers.get('origin') !== new URL(adminURL()).origin)
    throw new AdminError('Cross-origin admin request rejected.', 403); }
let instance: ReturnType<typeof betterAuth> | undefined;
let ready: Promise<void> | undefined;
let authDatabase: DatabaseSync | undefined;
export async function getAuth() {
    if (!adminEnabled() || !oauthReady())
        throw new AdminError('Google sign-in setup is unavailable. Configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BETTER_AUTH_SECRET and the super-admin email.', 503);
    if (!instance) {
        const store = adminStore();
        authDatabase = new DatabaseSync(path.join(adminDataPath(), 'auth.sqlite'));
        authDatabase.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000');
        instance = betterAuth<BetterAuthOptions>({ database: authDatabase, baseURL: adminURL(), secret: process.env.BETTER_AUTH_SECRET!, trustedOrigins: [new URL(adminURL()).origin],
            emailAndPassword: { enabled: false }, account: { accountLinking: { enabled: false } },
            socialProviders: { google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET!, scope: ['openid', 'email', 'profile'] } },
            session: { cookieCache: { enabled: false }, expiresIn: 60 * 60 * 8 },
            databaseHooks: { user: { create: { before: async (user) => {
                            if (!user.emailVerified || !store.admin(user.email)?.enabled)
                                throw new APIError('FORBIDDEN', { message: 'Named-admin access is required.' });
                            return { data: user };
                        } } }, session: { create: { before: async (session) => {
                            const user = authDatabase!.prepare('SELECT email,emailVerified FROM user WHERE id=?').get(session.userId) as {
                                email: string;
                                emailVerified: number;
                            } | undefined;
                            if (!user?.emailVerified || !store.admin(user.email)?.enabled)
                                throw new APIError('FORBIDDEN', { message: 'Admin access is not enabled.' });
                            return { data: session };
                        } } } }
        });
        ready = getMigrations(instance.options).then(m => m.runMigrations());
    }
    await ready;
    return instance!;
}
export async function requireAdmin(request: Request): Promise<Actor> {
    if (!adminEnabled())
        throw new AdminError('Admin workflow is disabled.', 404);
    const cookie = request.headers.get('cookie') ?? '';
    const token = /(?:^|;\s*)mosaic-dev-admin=([a-f0-9]{64})(?:;|$)/.exec(cookie)?.[1];
    if (token && developmentIdentityAllowed(request.url)) {
        const actor = adminStore().devActor(token);
        if (actor)
            return actor;
    }
    if (oauthReady()) {
        const auth = await getAuth(), session = await auth.api.getSession({ headers: request.headers });
        if (session?.user.emailVerified) {
            const store = adminStore(), grant = store.admin(session.user.email);
            if (grant?.enabled && (!grant.subject || grant.subject === session.user.id)) {
                store.db.prepare('UPDATE admins SET subject=? WHERE email=? AND subject IS NULL').run(session.user.id, grant.email);
                return { email: grant.email, role: grant.role, identity: 'google' };
            }
        }
    }
    throw new AdminError('Sign in with an approved admin account.', 401);
}
export function revokeAuthSessions(email: string) {
    const filename = path.join(adminDataPath(), 'auth.sqlite');
    if (!authDatabase && !existsSync(filename)) return;
    const database = authDatabase ?? new DatabaseSync(filename);
    try {
        if (database.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='session'").get())
            database.prepare('DELETE FROM session WHERE userId IN (SELECT id FROM user WHERE lower(email)=?)').run(email.toLowerCase());
    } finally {
        if (database !== authDatabase) database.close();
    }
}
