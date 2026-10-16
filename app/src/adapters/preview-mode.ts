// Build capability plus runtime opt-in; URLs and client data cannot activate this.
export function previewEnabled(env: Record<string,string|undefined> = process.env) {
 return process.env.CAPSTONE_PREVIEW_BUILD === "1" && env.CAPSTONE_PREVIEW_MODE === "synthetic";
}
export function previewReserved(env: Record<string,string|undefined> = process.env) {
 return process.env.CAPSTONE_PREVIEW_BUILD === "1" || Boolean(env.CAPSTONE_PREVIEW_MODE);
}
