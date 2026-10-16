import { previewEnabled } from "../../../adapters/preview-mode";
import { loadCanonicalConfig } from "../../../adapters/config-repository";
export const dynamic = "force-dynamic";
export function GET() {
 if (!previewEnabled()) return new Response(null,{status:404});
 try {const config=loadCanonicalConfig().config;return Response.json({status:"ok",mode:"synthetic",billable:false,build:process.env.CAPSTONE_RELEASE_ID ?? "local-preview",configVersion:config.version},{headers:{"Cache-Control":"no-store"}});}
 catch {return Response.json({status:"unhealthy"},{status:503});}
}
