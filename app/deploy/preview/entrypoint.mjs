import {readFileSync} from "node:fs";
import {spawn} from "node:child_process";
if (process.env.OPENAI_API_KEY || process.env.CAPSTONE_PREVIEW_MODE !== "synthetic" || process.env.RECOMMENDATION_PROVIDER !== "disabled") {
 console.error("Preview configuration rejected; credentials and live provider configuration are prohibited.");process.exit(1);
}
const release=JSON.parse(readFileSync(new URL("./preview-release.json",import.meta.url),"utf8"));
if(!/^[a-zA-Z0-9._-]{1,100}$/.test(release.id))throw new Error("Invalid release identity");
const child=spawn(process.execPath,["node_modules/next/dist/bin/next","start","--hostname","0.0.0.0","--port","3000"],{stdio:"inherit",env:{...process.env,CAPSTONE_RELEASE_ID:release.id}});
for(const signal of ["SIGTERM","SIGINT"])process.on(signal,()=>child.kill(signal));
child.on("exit",code=>process.exit(code??1));
