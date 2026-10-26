import {test,expect} from "@playwright/test";
test("normal build exposes no simulation route or health",async({request})=>{expect((await request.get("/preview?mode=synthetic")).status()).toBe(404);expect((await request.get("/api/preview-health")).status()).toBe(404);});
