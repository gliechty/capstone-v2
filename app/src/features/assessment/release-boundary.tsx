"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { AssessmentCatalog } from '../../application/assessment-catalog';
import { SESSION_KEY } from '../../adapters/assessment-session';
const Context = createContext<AssessmentCatalog | null>(null);
export const useReleaseCatalog = (fallback: AssessmentCatalog) => useContext(Context) ?? fallback;
export function ReleaseBoundary({ children }: {
    children: ReactNode;
}) {
    const pathname = usePathname(), needed = ['/assessment', '/assessment/quick', '/results', '/quick-results'].includes(pathname);
    return needed ? <PinnedCatalog key={pathname}>{children}</PinnedCatalog> : children;
}
function PinnedCatalog({ children }: {
    children: ReactNode;
}) {
    const [state, setState] = useState<{
        catalog: AssessmentCatalog | null;
        error: string | null;
    }>({ catalog: null, error: null });
    useEffect(() => {
        const controller = new AbortController();
        let version: string | undefined;
        try {
            const saved = sessionStorage.getItem(SESSION_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (typeof parsed.configVersion === 'string')
                    version = parsed.configVersion;
            }
        }
        catch { /* Existing session adapter displays damaged-storage warning. */ }
        void fetch('/api/assessment-catalog' + (version ? '?version=' + encodeURIComponent(version) : ''), { cache: 'no-store', signal: controller.signal }).then(async (r) => { const data = await r.json(); if (!r.ok)
            throw new Error(data.error); if (!controller.signal.aborted)
            setState({ catalog: data, error: null }); }).catch(e => { if (!controller.signal.aborted)
            setState({ catalog: null, error: e.message }); });
        return () => controller.abort();
    }, []);
    if (state.error)
        return <main className="page-container py-12"><h1>Assessment release unavailable</h1><p role="alert">{state.error}</p><p>Your saved session has not been replaced.</p></main>;
    if (!state.catalog)
        return <main className="page-container py-12" role="status">Loading your assessment release…</main>;
    return <Context.Provider value={state.catalog}><aside className="page-container" data-testid="assessment-release">Assessment release: {state.catalog.version}</aside>{children}</Context.Provider>;
}
