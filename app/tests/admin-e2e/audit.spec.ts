import {test,expect} from '@playwright/test';
import {createHash} from 'node:crypto';
import {auditCsv,auditTable} from '../../src/application/admin/audit-artifacts';
import type {Release} from '../../src/application/admin/contracts';
import type {ArchiveInfo} from '../../src/features/admin/audit-browser';
test.use({channel:'chromium'});
test('readable source/configuration/archive audit is immutable and downloadable',async({page,request})=>{
 for(const url of ['/api/admin/download/unknown/QuestionBank?format=csv','/api/admin/source/unknown/unknown?format=csv','/api/admin/archive-view/unknown','/api/admin/source-pdf/unknown/unknown'])expect((await request.get(url)).status()).toBe(401);
 await page.goto('/admin');await page.getByLabel('Email',{exact:true}).fill('owner@example.test');await page.getByRole('button',{name:'Use development identity'}).click();
 await expect(page.getByRole('button',{name:'Browse sources',exact:true})).toBeVisible();
 const before=await(await page.request.get('/api/admin/state')).json(),r:Release=before.active;
 expect(before.kb.sourceImport.by).toBe('owner@example.test');expect(before.kb.isDefault).toBe(true);expect(before.kb.sourceCount).toBe(r.config.DocumentIndex.length);
 await expect(page.getByRole('heading',{name:'Knowledge Base — Capstone Baseline'})).toBeVisible();await expect(page.getByText('★ Default assessment',{exact:true})).toBeVisible();
 await page.screenshot({path:'.local/admin-hierarchy-desktop.png',fullPage:true});
 const source=r.config.DocumentIndex.find(s=>r.config.DocumentChunks.some(c=>c.doc_id===s.doc_id))!;
 const chunks=r.config.DocumentChunks.filter(c=>c.doc_id===source.doc_id);
 expect(await page.locator('details').filter({has:page.locator('summary',{hasText:'Archived Extraction / QuestionBank Artifacts'})}).getAttribute('open')).toBeNull();
 await page.getByRole('button',{name:'Browse sources',exact:true}).click();await page.getByLabel('Find a source').fill(source.doc_id);
 await page.getByRole('button',{name:source.doc_title,exact:true}).click();
 await expect(page.getByText('Recovered from the recorded source link; identity with the historical extraction file has not been verified.',{exact:true})).toBeVisible();
 const [pdfDownload]=await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:'Download original',exact:true}).click()]);expect(pdfDownload.suggestedFilename()).toBe(source.doc_id+'.pdf');
 const pdfLink=page.getByRole('link',{name:'View PDF',exact:true});await expect(pdfLink).toHaveAttribute('target','_blank');
 const [viewer]=await Promise.all([page.waitForEvent('popup'),pdfLink.click()]);await expect(viewer).toHaveURL(new RegExp('/api/admin/source-pdf/'+r.id+'/'+source.doc_id));await viewer.waitForLoadState('load');
 const sources=await(await page.request.get('/api/admin/kb/'+r.id)).json();
 for(const item of sources.sources){const result=await page.request.get('/api/admin/source-pdf/'+r.id+'/'+item.id);expect(result.status()).toBe(200);expect(result.headers()['content-type']).toBe('application/pdf');expect(result.headers()['content-disposition']).toContain('inline');expect(createHash('sha256').update(await result.body()).digest('hex')).toBe(item.sha256);}
 await viewer.screenshot({path:'.local/admin-original-pdf.png'});await viewer.close();
 expect((await page.request.get('/api/admin/source-pdf/'+r.id+'/not-a-member')).status()).toBe(404);
 expect((await page.request.post('/api/admin/import-sources/'+r.id,{data:{by:'spoof@example.test'},headers:{Origin:'https://wrong.example'}})).status()).toBe(403);
 await page.request.post('/api/admin/import-sources/'+r.id,{data:{by:'spoof@example.test'},headers:{Origin:'http://localhost:3207'}});
 expect((await(await page.request.get('/api/admin/state')).json()).kb.sourceImport).toEqual(before.kb.sourceImport);
 await expect(page.getByText(chunks[0]!.chunk_text,{exact:true})).toBeVisible();
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:'Download retained excerpts CSV'}).click()]);
 expect(download.suggestedFilename()).toContain(r.id);
 const csv=await page.request.get('/api/admin/source/'+r.id+'/'+encodeURIComponent(source.doc_id)+'?format=csv');
 expect(csv.headers()['x-mosaic-release']).toBe(r.id);expect(await csv.text()).toBe(auditCsv(auditTable(chunks)));
 await page.getByRole('button',{name:'← Admin Center',exact:true}).click();await page.getByRole('button',{name:'View QuestionBank',exact:true}).click();await expect(page.getByRole('combobox')).toHaveCount(0);
 await page.getByLabel('Search records').fill(r.config.QuestionBank[0]!.question_id);await page.getByRole('button',{name:'View record 1',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Record details'})).toContainText(r.config.QuestionBank[0]!.question_text);
 for(const entity of ['QuestionBank','AnswerScales','MetricBenchmarks','MultiplierRules','CategoryWeights','DocumentIndex','DocumentChunks'] as const){
 const out=await page.request.get('/api/admin/download/'+r.id+'/'+entity+'?format=csv');expect(out.status()).toBe(200);expect(await out.text()).toBe(auditCsv(auditTable(r.config[entity])));
 }
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'.local/admin-audit-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Close record'}).click();await page.getByRole('button',{name:'← Admin Center',exact:true}).click();
 await page.getByText('Archived Extraction / QuestionBank Artifacts',{exact:true}).click();
 const archive=before.archives.find((a:ArchiveInfo)=>a.name.endsWith('.csv'));
 await page.getByRole('button',{name:archive.name,exact:true}).click();await expect(page.getByRole('table')).toBeVisible();
 for(const a of before.archives){const view=await page.request.get('/api/admin/archive-view/'+a.id);expect(view.status(),a.name).toBe(200);expect((await view.json()).sha256).toBe(a.sha256);const raw=await page.request.get('/api/admin/archive/'+a.id);expect(createHash('sha256').update(await raw.body()).digest('hex')).toBe(a.sha256);}
 expect((await page.request.get('/api/admin/archive-view/unknown')).status()).toBe(404);
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'.local/admin-audit-desktop.png',fullPage:true});
 const after=await(await page.request.get('/api/admin/state')).json();expect(after.active).toEqual(before.active);expect(after.releases).toEqual(before.releases);expect(after.audit).toEqual(before.audit);
});
