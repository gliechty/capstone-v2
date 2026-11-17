import mapping from '../../config/portraits/portrait_family_mapping_v0.2.json';
import { calculatePortrait, portraitLabels, archetypes, portraitMaturity } from './sustainability-portrait';
import { selectPortraitSubtype } from './portrait-subtype';
import { portraitReading, portraitFamilyDefinitions } from './portrait-reading';
import type { ScoreSummary } from './score-summary';
import type { ReportAssets } from './report-assets';
export const reportEscape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function reportImage(assets: ReportAssets, path: string, className = '', alt = '') {
 const source = assets[path];
 return source && /^data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+$/.test(source) ? `<img class="${className}" src="${source}" alt="${reportEscape(alt)}">` : '';
}
export function reportPortrait(score: ScoreSummary, assets: ReportAssets, calculatorIds: readonly string[]) {
 const portrait = calculatePortrait(score, mapping, calculatorIds);
 if (!portrait) return '<p>Portrait unavailable for this configuration. Scores remain authoritative.</p>';
 const pair = selectPortraitSubtype(portrait), h = reportEscape;
 const point = (index: number, value: number) => { const angle=-Math.PI/2+index*2*Math.PI/5; return [180+Math.cos(angle)*103*value,170+Math.sin(angle)*103*value]; };
 const points = (value: number) => portrait.families.map((_,i)=>point(i,value).join(',')).join(' ');
 const labels = [[180,40],[294,128],[254,291],[106,291],[66,128]];
 const complete = portrait.families.every(f=>f.readable);
 const chart = `<svg viewBox="0 0 360 330" role="img" aria-label="Family percentages of total eligible credit"><title>${portrait.families.map(f=>portraitLabels[f.id]+': '+(f.readable?Math.round(f.mean!*100)+'%':'insufficient evidence')).join('; ')}</title>${[1,.75,.5,.25].map(level=>`<polygon points="${points(level)}" fill="none" stroke="#d5d4cc"/>`).join('')}${portrait.families.map((_,i)=>{const [x,y]=point(i,1);return `<line x1="180" y1="170" x2="${x}" y2="${y}" stroke="#d5d4cc"/>`;}).join('')}${complete?`<polygon points="${portrait.families.map((f,i)=>point(i,f.mean!).join(',')).join(' ')}" fill="#2e7d7a" fill-opacity=".22" stroke="#2e7d7a" stroke-width="2"/>`:portrait.families.map((f,i)=>{const next=(i+1)%5;if(!f.readable||!portrait.families[next]!.readable)return '';const [x,y]=point(i,f.mean!),[x2,y2]=point(next,portrait.families[next]!.mean!);return `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="#2e7d7a" stroke-width="2"/>`;}).join('')}${portrait.families.map((f,i)=>{const [x,y]=point(i,f.mean??0),[lx,ly]=labels[i]!;return `<g>${f.readable?`<circle cx="${x}" cy="${y}" r="4" fill="#2e7d7a"/>`:''}<text x="${lx}" y="${ly}" text-anchor="middle" font-size="14" fill="#1b2a41" font-weight="${pair&&(f.id===pair.first.id||f.id===pair.second.id)?700:400}">${portraitLabels[f.id]}</text><text x="${lx}" y="${ly!+21}" text-anchor="middle" font-size="13" fill="#526477">${f.readable?Math.round(f.mean!*100)+'%':'—'}</text></g>`;}).join('')}</svg>`;
 const maturity=(value:number)=>{const m=portraitMaturity(value);return `<p class="maturity"><span aria-hidden="true">${'●'.repeat(m.dots)}${'○'.repeat(3-m.dots)}</span> Approach development · ${h(m.label)}</p>`;};
 return `<div class="portrait-layout"><div>${pair?reportImage(assets,'/portraits/roles/'+pair.definition.artwork.split('/').pop(),'role-icon'):''}<h3 class="portrait-title">${h(pair?.definition.name??portrait.name)}</h3>${pair?`<p class="family-pair">${portraitLabels[pair.first.id]} + ${portraitLabels[pair.second.id]}</p>${maturity(pair.combined)}`:''}<p>${h(portraitReading(portrait))}</p><p class="small">Your categories show what you address; your archetype shows how you approach it. This is an interpretation of reported answers, not verified organizational maturity.</p></div><figure>${chart}<figcaption>Each family percentage reflects questionnaire credit earned out of its total applicable credit. Unanswered questions lower these percentages. Outer edge: 100%. Gaps indicate insufficient evidence.</figcaption></figure></div>${pair?`<div class="constituents">${[pair.first,pair.second].map(f=>`<article>${reportImage(assets,'/portraits/arch-'+archetypes[f.id].toLowerCase()+'-small.svg','family-icon')}<h4>${portraitLabels[f.id]} · ${archetypes[f.id]}</h4><p>${portraitFamilyDefinitions[f.id]}</p>${maturity(f.mean!)}<p class="small">${(f.mean!*100).toFixed(1)}% credit · ${f.answered}/${f.applicable} eligible answers</p></article>`).join('')}</div>`:''}<details><summary>Portrait calculation and input basis</summary><p>Equal-weight credit across all applicable eligible items; both leading families need at least one valid answer. No strength floor. Ties use possible category-normalized weighted points, then Commit, Measure, Plan, Do, Engage. Combined development is the arithmetic mean of the two family percentages${pair?' ('+(pair.combined*100).toFixed(2)+'%)':''}. Emerging ≤50%; Growing >50–75%; Mature >75%. These beta labels describe approach development only.</p><p>Valid Measure-tagged numeric values, including zero, receive “figure supplied” credit, not verified measurement. Other numeric interpretations are deferred.</p><p>Deferred numeric items: ${h(portrait.excludedNumeric.join(', ')||'None')}. Unclassified exclusions: ${h(portrait.unclassified.join(', ')||'None')}.</p><ul>${portrait.families.map(f=>`<li>${portraitLabels[f.id]}: ${f.answered}/${f.applicable} eligible answers; input basis ${h(f.inputBasis)}.</li>`).join('')}</ul><span hidden data-portrait-versions="${h(JSON.stringify(portrait.versions))}"></span></details>`;
}
export const reportStyles = `
/* Embedded Manrope font license
Copyright 2018 The Manrope Project Authors (https://github.com/googlefonts/manrope)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded, 
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.

*/

*{box-sizing:border-box}html{background:#eeeae1}body{font:15px/1.65 Manrope,"Segoe UI",sans-serif;color:#1b2a41;margin:0 auto;max-width:960px;background:#fffdf9}h1,h2,h3,h4{line-height:1.2;break-after:avoid;font-weight:600;letter-spacing:-.025em}h1{font-size:42px;margin:25px 0}h2{font-size:27px;margin:0 0 22px}h3{font-size:20px}h4{font-size:16px}p{margin:12px 0}p,dd,li,td{overflow-wrap:anywhere}a{color:#24605e;text-underline-offset:3px}section{padding:42px 50px;border-top:1px solid #e4e0d6}section section{padding:0;border:0}.eyebrow{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#24605e;font-weight:700}.cover{position:relative;min-height:850px;display:flex;flex-direction:column;justify-content:space-between;isolation:isolate;overflow:hidden}.watermark{position:absolute;width:420px;height:420px;object-fit:contain;right:-30px;top:170px;opacity:.045;z-index:-1}.wordmark{width:170px;height:auto}.cover-purpose{max-width:550px;font-size:20px}.small,figcaption{font-size:12px;color:#526477;line-height:1.55}.cover dl{display:grid;grid-template-columns:repeat(2,1fr);gap:12px 30px}.cover dl div{break-inside:avoid}dt{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#526477}dd{margin:3px 0}.score-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:20px 0}.score-box{border-left:3px solid #2e7d7a;padding:12px 20px;background:#f1f5f1}.score-value{font-size:48px;line-height:1.2;letter-spacing:-.05em}.score-value small{font-size:16px;letter-spacing:0}.coverage{color:#24605e;font-weight:600}.category{display:grid;grid-template-columns:145px 1fr 60px;align-items:center;gap:16px;margin:17px 0}.bar{height:9px;background:#eeeae1;border-radius:10px;overflow:hidden}.bar span{display:block;height:100%;background:#2e7d7a}.category-name{display:flex;align-items:center;gap:9px}.category-icon{width:22px;height:22px;object-fit:contain}.portrait-layout{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:center}.portrait-title{font-size:36px;margin:10px 0}.family-pair{color:#24605e;font-size:20px;font-weight:600}.role-icon{width:85px;height:85px;object-fit:contain}.family-icon{width:34px;height:34px;object-fit:contain}.constituents{display:grid;grid-template-columns:1fr 1fr;gap:24px;border-top:1px solid #e4e0d6;margin-top:20px;padding-top:20px}.constituents h4{margin:8px 0}.constituents p{margin:6px 0}.maturity{font-size:12px;color:#24605e}.maturity span{letter-spacing:3px;margin-right:8px}figure{margin:0}figure svg{width:100%;height:auto}details{margin-top:24px;font-size:12px}summary{cursor:pointer;font-weight:600;color:#24605e;padding:10px 0}details p{margin:8px 0}.recommendation{padding:20px 0;border-top:1px solid #e4e0d6;break-inside:avoid}.recommendation h3{margin-top:0}.recommendation .rank{color:#a64b20}.reference-list{font-size:12px;padding-left:20px}.reference-list li{margin:12px 0}.lever{border-left:3px solid #a64b20;padding:8px 20px;margin:20px 0;break-inside:avoid}.lever h3{margin:4px 0}.gain{color:#a64b20;font-weight:600}.callout{padding:16px 20px;background:#f1ede4;border-radius:8px}.screen{padding:15px 30px;font-size:13px;background:#e3efee}.evidence-table{font-size:11px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{padding:9px 6px;border-bottom:1px solid #e4e0d6;text-align:left;vertical-align:top}th{color:#24605e}tr{break-inside:avoid}thead{display:table-header-group}.metadata{font-size:11px;color:#526477}section>p,li{orphans:3;widows:3}footer{font-size:11px;margin-top:30px;color:#526477}
@media(max-width:600px){section{padding:30px 22px}h1{font-size:32px}.cover{min-height:700px}.cover dl,.portrait-layout,.constituents{grid-template-columns:1fr}.score-grid{gap:8px}.score-box{padding:10px}.score-value{font-size:36px}.category{grid-template-columns:120px 1fr 48px;gap:8px}.watermark{width:300px}.evidence-table{font-size:10px}}
@media print{@page{size:A4;margin:15mm 14mm 17mm}html,body{background:white}body{max-width:none;font-size:10pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}section{padding:0;border:0;margin:0;break-before:page}.cover{min-height:250mm;padding:10mm 0}.cover h1{font-size:35pt}.cover-purpose{font-size:15pt}.screen{display:none}h2{font-size:23pt}h3{font-size:15pt}.portrait-title{font-size:29pt}.score-value{font-size:37pt}.score-box{padding:12px 18px}.small,figcaption{font-size:9pt}.portrait-layout{grid-template-columns:1fr 1fr}.constituents{grid-template-columns:1fr 1fr}.cover dl{grid-template-columns:1fr 1fr}details{font-size:8pt;margin-top:14px}details p{margin:4px 0}details ul{margin:6px 0;padding-left:18px}#priority-levers .lever{margin:8px 0;padding:4px 14px}#priority-levers .lever h3{font-size:11pt}#priority-levers .lever p{margin:4px 0}#priority-levers .lever .small{font-size:8pt}#priority-levers .callout{font-size:9pt}details::details-content{display:block;content-visibility:visible}summary{display:none}.reference-list{font-size:9pt}.metadata{font-size:8pt}table{font-size:9pt}.evidence-table{font-size:8pt}.recommendation{break-inside:avoid}a{color:#24605e}#hypothetical-levers{break-before:page}}
`;

// Browser-native paged-media branding; embedded assets remain portable in HTML/PDF.
export function reportPageBranding(assets: ReportAssets) {
 const safe=(path:string)=>/^data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+$/.test(assets[path]??'') ? assets[path] : '';
 const mark=safe('/brand/mosaic-mark.svg'),word=safe('/brand/mosaic-wordmark.svg');
 // A layout wrapper embeds the original two assets unchanged; no paths or proportions are redrawn.
 const footerLogo = mark && word ? 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="32" viewBox="0 0 160 32"><image href="'+mark+'" x="0" y="2" width="28" height="28"/><image href="'+word+'" x="36" y="2" width="124" height="28"/></svg>') : '';
 return `
body{position:relative;isolation:isolate}section{position:relative;z-index:1}.screen{position:relative;z-index:2}.watermark{position:fixed;right:calc((100vw - min(100vw,960px))/2 + 20px);top:25vh;width:400px;height:400px;object-fit:contain;opacity:.035;z-index:0;pointer-events:none}.cover{min-height:0;display:block;overflow:visible;isolation:auto}.cover-brand-row{display:flex;justify-content:space-between;align-items:center;gap:28px}.mosaic-lockup{display:flex;align-items:center;gap:15px;width:60%}.lockup-grid{width:65px;height:65px;object-fit:contain}.wordmark{width:200px;max-width:calc(100% - 80px);height:auto}.institution{text-align:right;font-size:22px;line-height:1.2;letter-spacing:-.02em}.institution span{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.09em;color:#526477;margin-top:7px}.identity-line{font-size:10px;letter-spacing:.08em;max-width:460px;margin:18px 0 28px}.cover h1{font-size:34px;margin:10px 0}.cover-purpose{font-size:17px;margin:8px 0}.cover dl{gap:10px 28px;margin:24px 0}.cover dd{font-size:13px}.cover-heading>.eyebrow{margin-bottom:8px}.contents{margin-top:24px;border-top:1px solid #e4e0d6;padding-top:18px}.contents h2{font-size:20px;margin:0 0 14px}.contents ol{display:grid;grid-template-columns:1fr 1fr;gap:10px 32px;margin:0;padding-left:20px;font-size:13px}.contents li{padding-left:3px}.cover footer{margin-top:25px;line-height:1.55}.generated-date{font-size:9px}.context-details dl{display:grid;grid-template-columns:1fr 1fr;gap:8px 20px}.context-details dl div{break-inside:avoid}
@media(max-width:600px){.cover-brand-row{gap:14px;align-items:flex-start}.mosaic-lockup{width:59%;gap:8px}.lockup-grid{width:38px;height:38px}.wordmark{width:140px;max-width:calc(100% - 46px)}.institution{font-size:16px}.institution span{font-size:8px}.identity-line{font-size:9px}.cover h1{font-size:30px}.cover dl{grid-template-columns:1fr 1fr;gap:12px 16px}.contents ol{grid-template-columns:1fr;gap:9px}.watermark{width:280px;height:280px;right:10px;top:30vh}}
@media print{
 @page{margin:15mm 14mm 22mm;
  @bottom-left{content:url('${footerLogo}');width:48mm;text-align:left;vertical-align:middle;}
  @bottom-center{content:counter(page) " / " counter(pages);font:8pt Arial,sans-serif;color:#526477;}
  @bottom-right{content:none;}
 }
 @page:first{@bottom-left{content:none;background:none}@bottom-right{content:none}}
 .watermark{right:4mm;top:65mm;width:110mm;height:110mm;opacity:.035}
 .cover{min-height:0;padding:0}.cover-brand-row{gap:12mm}.mosaic-lockup{width:58%;gap:4mm}.lockup-grid{width:18mm;height:18mm}.wordmark{width:58mm;max-width:calc(100% - 22mm)}.institution{font-size:19pt}.institution span{font-size:8pt}.identity-line{font-size:8pt;max-width:120mm;margin:5mm 0 9mm}.cover h1{font-size:28pt;margin:3mm 0}.cover-purpose{font-size:12pt}.cover dl{grid-template-columns:1fr 1fr;gap:3mm 8mm;margin:6mm 0}.cover dd{font-size:10pt}.cover dt{font-size:8pt}.contents{margin-top:6mm;padding-top:5mm}.contents h2{font-size:16pt;margin-bottom:4mm}.contents ol{font-size:10pt;grid-template-columns:1fr 1fr;gap:3mm 8mm}.cover footer{margin-top:7mm;font-size:8pt}.generated-date{font-size:7pt}.context-details summary{display:block;list-style:none}.context-details{break-inside:avoid}#methodology{font-size:9pt;line-height:1.45}#methodology h3{font-size:13pt;margin:14px 0 6px}#methodology p{margin:8px 0}#methodology td,#methodology th{padding:6px}
}
`;
}
