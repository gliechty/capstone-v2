import {test,expect} from '@playwright/test';
const origin='http://localhost:3207';
test('named-admin grant, server-side restrictions and revoke remain enforced',async({page,browser,request})=>{
 expect((await request.get('/api/admin/state')).status()).toBe(401);
 await page.goto('/admin');await page.getByLabel('Email',{exact:true}).fill('owner@example.test');await page.getByRole('button',{name:'Use development identity'}).click();
 await page.getByText('Admin access',{exact:true}).click();await page.getByLabel('Admin email').fill('editor@example.test');await page.getByRole('button',{name:'Grant admin access'}).click();await expect(page.getByRole('status')).toContainText('Admin access granted');
 const context=await browser.newContext(),editor=await context.newPage();await editor.goto(origin+'/admin');await editor.getByLabel('Email',{exact:true}).fill('editor@example.test');await editor.getByRole('button',{name:'Use development identity'}).click();await expect(editor.getByRole('button',{name:'Open QuestionBank',exact:true})).toBeVisible();
 expect((await(await editor.request.get('/api/admin/state')).json()).actor).toMatchObject({email:'editor@example.test',role:'admin'});
 expect((await editor.request.post('/api/admin/access',{data:{email:'other@example.test',enabled:true},headers:{Origin:origin}})).status()).toBe(403);
 expect((await editor.request.post('/api/admin/create-draft',{data:{},headers:{Origin:'https://wrong.example'}})).status()).toBe(403);
 const state=await(await editor.request.get('/api/admin/state')).json();const q=state.active.config.QuestionBank[0];
 const review=await editor.request.post('/api/admin/question-review',{data:{base:state.active.id,expectedLatest:state.releases[0].id,edits:[{question_id:q.question_id,question_text:q.question_text+' Reviewed'}],quickChoices:{}},headers:{Origin:origin}});expect(review.status()).toBe(200);
 await page.getByRole('button',{name:'Revoke access for editor@example.test',exact:true}).click();await expect(page.getByRole('button',{name:'Restore access for editor@example.test',exact:true})).toBeVisible();expect((await editor.request.get('/api/admin/state')).status()).toBe(401);expect((await editor.request.post('/api/admin/question-save',{data:{},headers:{Origin:origin}})).status()).toBe(401);
 await context.close();
});
